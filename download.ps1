[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$response = Invoke-WebRequest -Uri "https://mosiqati.com/ar/%D9%85%D8%AA%D8%AC%D8%B1-%D8%A8%D9%8A%D8%B9-%D8%A7%D9%84%D8%A7%D8%AA-%D9%85%D9%88%D8%B3%D9%8A%D9%82%D9%8A%D8%A9-%D9%81%D9%8A-%D8%A7%D9%84%D8%A7%D8%B1%D8%AF%D9%86/" -UseBasicParsing
$html = $response.Content
$html | Out-File -FilePath "mosiqati_raw.html" -Encoding UTF8
