# =============================================================================
# Custom Domain and HTTPS Setup Script for Azure Container Apps (PowerShell)
# Domain: quiz2biz.com (GoDaddy)
# =============================================================================

param(
    [string]$ResourceGroup = "rg-questionnaire-prod",
    [string]$ContainerAppName = "ca-questionnaire-api-prod",
    [string]$CustomDomain = "quiz2biz.com",
    [string]$Environment = "prod"
)

# Colors for output
function Write-Success { param($Message) Write-Host $Message -ForegroundColor Green }
function Write-Info { param($Message) Write-Host $Message -ForegroundColor Cyan }
function Write-Warning { param($Message) Write-Host $Message -ForegroundColor Yellow }
function Write-Error { param($Message) Write-Host $Message -ForegroundColor Red }

Write-Success "============================================="
Write-Success "  Custom Domain & HTTPS Setup                "
Write-Success "  Domain: $CustomDomain                      "
Write-Success "============================================="

# Check prerequisites
Write-Info "`nStep 1: Checking prerequisites..."

# Check Azure CLI
if (-not (Get-Command az -ErrorAction SilentlyContinue)) {
    Write-Error "Error: Azure CLI is not installed."
    Write-Warning "Install from: https://aka.ms/installazurecli"
    exit 1
}

# Check Azure login
try {
    $null = az account show 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Error: Not logged in to Azure. Run 'az login' first."
        exit 1
    }
} catch {
    Write-Error "Error: Not logged in to Azure. Run 'az login' first."
    exit 1
}

Write-Success "Prerequisites check passed."

# Get Container App details
Write-Info "`nStep 2: Getting Container App information..."

$containerAppCheck = az containerapp show `
    --name $ContainerAppName `
    --resource-group $ResourceGroup `
    --query name -o tsv 2>$null

if (-not $containerAppCheck) {
    Write-Error "Error: Container App '$ContainerAppName' not found in resource group '$ResourceGroup'"
    Write-Warning "Available container apps:"
    az containerapp list --resource-group $ResourceGroup --query "[].name" -o table
    exit 1
}

$defaultDomain = az containerapp show `
    --name $ContainerAppName `
    --resource-group $ResourceGroup `
    --query properties.configuration.ingress.fqdn -o tsv

Write-Success "Container App found: $ContainerAppName"
Write-Success "Default domain: $defaultDomain"

# Get validation token for domain
Write-Info "`nStep 3: Adding custom domain and getting validation token..."

$validationToken = az containerapp hostname add `
    --hostname $CustomDomain `
    --resource-group $ResourceGroup `
    --name $ContainerAppName `
    --query customDomainVerificationId -o tsv 2>&1

if ($validationToken -match "error" -or $validationToken -match "ERROR") {
    Write-Warning "Domain may already exist, retrieving verification token..."
    $validationToken = az containerapp show `
        --name $ContainerAppName `
        --resource-group $ResourceGroup `
        --query properties.customDomainVerificationId -o tsv
}

Write-Success "Domain Validation Token: $validationToken"

# Display DNS configuration instructions
Write-Host ""
Write-Info "============================================="
Write-Info "  DNS CONFIGURATION REQUIRED (GoDaddy)      "
Write-Info "============================================="
Write-Host ""
Write-Warning "Please configure the following DNS records in GoDaddy:"
Write-Host ""
Write-Success "1. TXT Record for Domain Verification:"
Write-Host "   Type:     " -NoNewline; Write-Info "TXT"
Write-Host "   Name:     " -NoNewline; Write-Info "asuid.quiz2biz.com" -NoNewline; Write-Host " (or just 'asuid' if GoDaddy auto-adds domain)"
Write-Host "   Value:    " -NoNewline; Write-Info "$validationToken"
Write-Host "   TTL:      " -NoNewline; Write-Info "600" -NoNewline; Write-Host " (10 minutes)"
Write-Host ""
Write-Success "2. CNAME Record for Domain Mapping:"
Write-Host "   Type:     " -NoNewline; Write-Info "CNAME"
Write-Host "   Name:     " -NoNewline; Write-Info "@" -NoNewline; Write-Host " (for root domain) or " -NoNewline; Write-Info "www" -NoNewline; Write-Host " (for www subdomain)"
Write-Host "   Value:    " -NoNewline; Write-Info "$defaultDomain"
Write-Host "   TTL:      " -NoNewline; Write-Info "3600" -NoNewline; Write-Host " (1 hour)"
Write-Host ""
Write-Warning "Note: For root domain (@), some DNS providers require an A record instead."
Write-Warning "If CNAME is not allowed for root, you may need to use GoDaddy's forwarding feature."
Write-Host ""
Write-Info "============================================="
Write-Host ""

# Wait for DNS propagation
Write-Warning "Waiting for DNS propagation..."
Write-Warning "This usually takes 5-15 minutes but can take up to 48 hours."
Write-Host ""
$continue = Read-Host "Press Enter once you've configured DNS records in GoDaddy and want to verify"

# Verify DNS configuration
Write-Info "`nStep 4: Verifying DNS configuration..."

Write-Host "Checking TXT record for domain verification..."
try {
    $txtCheck = (Resolve-DnsName -Name "asuid.$CustomDomain" -Type TXT -ErrorAction SilentlyContinue).Strings -join ""
    if ($txtCheck) {
        Write-Success "TXT record found: $txtCheck"
    } else {
        Write-Warning "Warning: TXT record not found yet. DNS may still be propagating."
    }
} catch {
    Write-Warning "Warning: TXT record not found yet. DNS may still be propagating."
}

Write-Host "Checking CNAME/A record..."
try {
    $cnameCheck = (Resolve-DnsName -Name $CustomDomain -ErrorAction SilentlyContinue).IPAddress -join ", "
    if ($cnameCheck) {
        Write-Success "DNS record found, resolves to: $cnameCheck"
    } else {
        Write-Warning "Warning: CNAME/A record not found yet. DNS may still be propagating."
        $continue = Read-Host "Continue anyway? (y/n)"
        if ($continue -ne "y") {
            Write-Warning "Exiting. Please wait for DNS propagation and try again."
            exit 0
        }
    }
} catch {
    Write-Warning "Warning: DNS record not found yet. DNS may still be propagating."
    $continue = Read-Host "Continue anyway? (y/n)"
    if ($continue -ne "y") {
        Write-Warning "Exiting. Please wait for DNS propagation and try again."
        exit 0
    }
}

# Bind custom domain
Write-Info "`nStep 5: Binding custom domain to Container App..."

az containerapp hostname bind `
    --hostname $CustomDomain `
    --resource-group $ResourceGroup `
    --name $ContainerAppName `
    --environment $Environment `
    --validation-method CNAME

if ($LASTEXITCODE -eq 0) {
    Write-Success "Custom domain bound successfully!"
} else {
    Write-Error "Failed to bind custom domain. Check DNS configuration and try again."
    exit 1
}

# Enable managed certificate (automatic HTTPS)
Write-Info "`nStep 6: Enabling managed SSL certificate..."

az containerapp hostname bind `
    --hostname $CustomDomain `
    --resource-group $ResourceGroup `
    --name $ContainerAppName `
    --environment $Environment `
    --validation-method CNAME

Write-Success "Managed SSL certificate provisioning initiated!"
Write-Warning "Certificate provisioning can take 5-10 minutes."

# Wait and check certificate status
Write-Info "`nStep 7: Checking certificate status..."

for ($i = 1; $i -le 20; $i++) {
    $certStatus = az containerapp hostname list `
        --name $ContainerAppName `
        --resource-group $ResourceGroup `
        --query "[?name=='$CustomDomain'].bindingType" -o tsv
    
    if ($certStatus -eq "SniEnabled") {
        Write-Success "SSL certificate is active!"
        break
    }
    
    Write-Host "Attempt $i/20: Certificate status: $certStatus, waiting 30 seconds..."
    Start-Sleep -Seconds 30
}

# Verify HTTPS
Write-Info "`nStep 8: Verifying HTTPS configuration..."

try {
    $response = Invoke-WebRequest -Uri "https://$CustomDomain/health" -UseBasicParsing -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Success "HTTPS verification successful!"
    } else {
        Write-Warning "HTTPS verification returned HTTP $($response.StatusCode)"
        Write-Warning "The site may need more time to be fully accessible."
    }
} catch {
    Write-Warning "HTTPS verification failed: $($_.Exception.Message)"
    Write-Warning "The site may need more time to be fully accessible."
}

# Summary
Write-Host ""
Write-Success "============================================="
Write-Success "  Setup Complete!                            "
Write-Success "============================================="
Write-Host ""
Write-Info "Your application URLs:"
Write-Host "  Primary:      " -NoNewline; Write-Success "https://$CustomDomain"
Write-Host "  Health Check: " -NoNewline; Write-Success "https://$CustomDomain/health"
Write-Host "  API Docs:     " -NoNewline; Write-Success "https://$CustomDomain/docs"
Write-Host "  API v1:       " -NoNewline; Write-Success "https://$CustomDomain/api/v1"
Write-Host ""
Write-Info "Default Azure URL (still accessible):"
Write-Host "  $defaultDomain"
Write-Host ""
Write-Warning "Note: SSL certificate auto-renews before expiration."
Write-Warning "Both HTTP and HTTPS are supported, with automatic redirect to HTTPS."
Write-Host ""
Write-Success "============================================="
