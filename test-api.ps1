# PowerShell API Test Script
Write-Host "Testing Blood Disease Classification API Endpoints" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host ""

$baseUrl = "http://localhost:5000/api"
$headers = @{"Content-Type" = "application/json"}

# Test 1: Health Check
Write-Host "1. Testing Health Check..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/health" -Method GET
    Write-Host "✅ SUCCESS" -ForegroundColor Green
    Write-Host ($response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10)
} catch {
    Write-Host "❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 2: Prediction
Write-Host "2. Testing Prediction Endpoint..." -ForegroundColor Yellow
try {
    $body = @{
        glucose = 120
        hemoglobin = 14.5
        platelets = 250000
        cholesterol = 180
        whiteBloodCells = 7000
        hematocrit = 42
    } | ConvertTo-Json
    
    $response = Invoke-WebRequest -Uri "$baseUrl/predict" -Method POST -Headers $headers -Body $body
    Write-Host "✅ SUCCESS" -ForegroundColor Green
    Write-Host ($response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10)
} catch {
    Write-Host "❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 3: Live Metrics
Write-Host "3. Testing Live Metrics..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/live-metrics" -Method GET
    Write-Host "✅ SUCCESS" -ForegroundColor Green
    Write-Host ($response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10)
} catch {
    Write-Host "❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 4: Recent Predictions
Write-Host "4. Testing Recent Predictions..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/recent-predictions?limit=5" -Method GET
    Write-Host "✅ SUCCESS" -ForegroundColor Green
    Write-Host ($response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10)
} catch {
    Write-Host "❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 5: Disease Distribution
Write-Host "5. Testing Disease Distribution..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/disease-distribution" -Method GET
    Write-Host "✅ SUCCESS" -ForegroundColor Green
    Write-Host ($response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10)
} catch {
    Write-Host "❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 6: Statistics
Write-Host "6. Testing Statistics..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/stats" -Method GET
    Write-Host "✅ SUCCESS" -ForegroundColor Green
    Write-Host ($response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10)
} catch {
    Write-Host "❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 7: Create Chat Session
Write-Host "7. Testing Chatbot Session Creation..." -ForegroundColor Yellow
$sessionId = $null
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/chatbot/session" -Method POST -Headers $headers
    Write-Host "✅ SUCCESS" -ForegroundColor Green
    $sessionData = $response.Content | ConvertFrom-Json
    $sessionId = $sessionData.sessionId
    Write-Host "Session ID: $sessionId" -ForegroundColor Cyan
    Write-Host ($sessionData | ConvertTo-Json -Depth 10)
} catch {
    Write-Host "❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 8: Send Chat Message
if ($sessionId) {
    Write-Host "8. Testing Chat Message..." -ForegroundColor Yellow
    try {
        $messageBody = @{
            sessionId = $sessionId
            message = "What are the symptoms of diabetes?"
        } | ConvertTo-Json
        
        $response = Invoke-WebRequest -Uri "$baseUrl/chatbot/message" -Method POST -Headers $headers -Body $messageBody
        Write-Host "✅ SUCCESS" -ForegroundColor Green
        Write-Host ($response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10)
    } catch {
        Write-Host "❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
    }
    Write-Host ""
    
    # Test 9: Get Chat History
    Write-Host "9. Testing Chat History..." -ForegroundColor Yellow
    try {
        $response = Invoke-WebRequest -Uri "$baseUrl/chatbot/history?sessionId=$sessionId" -Method GET
        Write-Host "✅ SUCCESS" -ForegroundColor Green
        Write-Host ($response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10)
    } catch {
        Write-Host "❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
    }
    Write-Host ""
} else {
    Write-Host "8. Skipping Chat Message Test (no session ID)" -ForegroundColor Yellow
    Write-Host "9. Skipping Chat History Test (no session ID)" -ForegroundColor Yellow
}

Write-Host "API Testing Complete!" -ForegroundColor Green
Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
