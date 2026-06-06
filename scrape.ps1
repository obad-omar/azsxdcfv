[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$response = Invoke-WebRequest -Uri 'https://mosiqati.com/ar/%D9%85%D8%AA%D8%AC%D8%B1-%D8%A8%D9%8A%D8%B9-%D8%A7%D9%84%D8%A7%D8%AA-%D9%85%D9%88%D8%B3%D9%8A%D9%82%D9%8A%D8%A9-%D9%81%D9%8A-%D8%A7%D9%84%D8%A7%D8%B1%D8%AF%D9%86/?srsltid=AfmBOopNfdMW_Y0utapNkI36SFzMVmctSNba1CSPe3r7RurzfsbYIGSg&v=674f33841e23' -UseBasicParsing
$html = $response.Content

# Find all blocks containing products
$pattern = '<h2 class="woocommerce-loop-product__title">(.*?)</h2>.*?<span class="woocommerce-Price-amount amount"><bdi>([^<]*?)</bdi></span>'
$matches = [regex]::Matches($html, $pattern, 'Singleline')
$results = @()

foreach ($m in $matches) {
    $title = $m.Groups[1].Value -replace '<[^>]+>',''
    $title = $title.Trim()
    
    $price = $m.Groups[2].Value -replace '&nbsp;',' '
    $price = $price -replace 'د\.ا',''
    $price = $price.Trim()
    
    $results += @{ title = $title; price = $price }
}

$results | ConvertTo-Json -Compress
