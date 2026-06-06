$html = Get-Content -Path 'mosiqati_raw.html' -Raw -Encoding UTF8
$pattern = '<h2 class="woocommerce-loop-product__title">(.*?)</h2>.*?<bdi>([^<]*?)</bdi>'
$matches = [regex]::Matches($html, $pattern, 'Singleline')
foreach ($m in $matches) {
    $t = $m.Groups[1].Value.Trim()
    $p = $m.Groups[2].Value.Trim()
    
    $p = $p -replace '&nbsp;',' '
    $p = $p -replace '<span class="woocommerce-Price-currencySymbol">د\.ا</span>',''
    
    Write-Output "$t | $p"
}
