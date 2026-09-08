# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: vr-tests/products.vr.spec.ts >> Visual regression - products >> VR-04: catalog grid
- Location: vr-tests/products.vr.spec.ts:16:7

# Error details

```
Test timeout of 60000ms exceeded.
```

```
Error: locator.evaluate: Test timeout of 60000ms exceeded.
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - banner [ref=e2]:
    - generic [ref=e5]:
      - link [ref=e8] [cursor=pointer]:
        - /url: /
        - img "Website for automation practice" [ref=e9]
      - list [ref=e12]:
        - listitem [ref=e13]:
          - link " Home" [ref=e14] [cursor=pointer]:
            - /url: /
            - generic [ref=e15]: 
            - text: Home
        - listitem [ref=e16]:
          - link " Products" [ref=e17] [cursor=pointer]:
            - /url: /products
            - generic [ref=e18]: 
            - text: Products
        - listitem [ref=e19]:
          - link " Cart" [ref=e20] [cursor=pointer]:
            - /url: /view_cart
            - generic [ref=e21]: 
            - text: Cart
        - listitem [ref=e22]:
          - link " Signup / Login" [ref=e23] [cursor=pointer]:
            - /url: /login
            - generic [ref=e24]: 
            - text: Signup / Login
        - listitem [ref=e25]:
          - link " Test Cases" [ref=e26] [cursor=pointer]:
            - /url: /test_cases
            - generic [ref=e27]: 
            - text: Test Cases
        - listitem [ref=e28]:
          - link " API Testing" [ref=e29] [cursor=pointer]:
            - /url: /api_list
            - generic [ref=e30]: 
            - text: API Testing
        - listitem [ref=e31]:
          - link " Video Tutorials" [ref=e32] [cursor=pointer]:
            - /url: https://www.youtube.com/c/AutomationExercise
            - generic [ref=e33]: 
            - text: Video Tutorials
        - listitem [ref=e34]:
          - link " Contact us" [ref=e35] [cursor=pointer]:
            - /url: /contact_us
            - generic [ref=e36]: 
            - text: Contact us
  - generic [ref=e38]:
    - img "Website for practice" [ref=e39]
    - textbox "Search Product" [ref=e40]
    - button "" [ref=e41] [cursor=pointer]
  - generic [ref=e45]:
    - generic [ref=e47]:
      - heading "Category" [level=2] [ref=e48]
      - generic [ref=e49]:
        - heading [level=4] [ref=e52]:
          - link " Women" [ref=e53] [cursor=pointer]:
            - /url: "#Women"
            - generic [ref=e54]: 
            - text: Women
        - heading [level=4] [ref=e58]:
          - link " Men" [ref=e59] [cursor=pointer]:
            - /url: "#Men"
            - generic [ref=e60]: 
            - text: Men
        - heading [level=4] [ref=e64]:
          - link " Kids" [ref=e65] [cursor=pointer]:
            - /url: "#Kids"
            - generic [ref=e66]: 
            - text: Kids
      - generic [ref=e68]:
        - heading "Brands" [level=2] [ref=e69]
        - list [ref=e71]:
          - listitem [ref=e72]:
            - link "(6) Polo" [ref=e73] [cursor=pointer]:
              - /url: /brand_products/Polo
              - generic [ref=e74]: (6)
              - text: Polo
          - listitem [ref=e75]:
            - link "(5) H&M" [ref=e76] [cursor=pointer]:
              - /url: /brand_products/H&M
              - generic [ref=e77]: (5)
              - text: H&M
          - listitem [ref=e78]:
            - link "(5) Madame" [ref=e79] [cursor=pointer]:
              - /url: /brand_products/Madame
              - generic [ref=e80]: (5)
              - text: Madame
          - listitem [ref=e81]:
            - link "(3) Mast & Harbour" [ref=e82] [cursor=pointer]:
              - /url: /brand_products/Mast & Harbour
              - generic [ref=e83]: (3)
              - text: Mast & Harbour
          - listitem [ref=e84]:
            - link "(4) Babyhug" [ref=e85] [cursor=pointer]:
              - /url: /brand_products/Babyhug
              - generic [ref=e86]: (4)
              - text: Babyhug
          - listitem [ref=e87]:
            - link "(3) Allen Solly Junior" [ref=e88] [cursor=pointer]:
              - /url: /brand_products/Allen Solly Junior
              - generic [ref=e89]: (3)
              - text: Allen Solly Junior
          - listitem [ref=e90]:
            - link "(3) Kookie Kids" [ref=e91] [cursor=pointer]:
              - /url: /brand_products/Kookie Kids
              - generic [ref=e92]: (3)
              - text: Kookie Kids
          - listitem [ref=e93]:
            - link "(5) Biba" [ref=e94] [cursor=pointer]:
              - /url: /brand_products/Biba
              - generic [ref=e95]: (5)
              - text: Biba
    - generic [ref=e97]:
      - heading "All Products" [level=2] [ref=e98]
      - generic [ref=e100]:
        - generic [ref=e101]:
          - generic [ref=e102]:
            - img "ecommerce website products" [ref=e103]
            - heading "Rs. 500" [level=2] [ref=e104]
            - paragraph [ref=e105]: Blue Top
            - generic [ref=e106] [cursor=pointer]:
              - generic [ref=e107]: 
              - text: Add to cart
          - generic [ref=e108]:
            - heading "Rs. 500" [level=2] [ref=e109]
            - paragraph [ref=e110]: Blue Top
            - generic [ref=e111] [cursor=pointer]:
              - generic [ref=e112]: 
              - text: Add to cart
        - list [ref=e114]:
          - listitem [ref=e115]:
            - link " View Product" [ref=e116] [cursor=pointer]:
              - /url: /product_details/1
              - generic [ref=e117]: 
              - text: View Product
      - generic [ref=e119]:
        - generic [ref=e120]:
          - generic [ref=e121]:
            - img "ecommerce website products" [ref=e122]
            - heading "Rs. 400" [level=2] [ref=e123]
            - paragraph [ref=e124]: Men Tshirt
            - generic [ref=e125] [cursor=pointer]:
              - generic [ref=e126]: 
              - text: Add to cart
          - generic [ref=e127]:
            - heading "Rs. 400" [level=2] [ref=e128]
            - paragraph [ref=e129]: Men Tshirt
            - generic [ref=e130] [cursor=pointer]:
              - generic [ref=e131]: 
              - text: Add to cart
        - list [ref=e133]:
          - listitem [ref=e134]:
            - link " View Product" [ref=e135] [cursor=pointer]:
              - /url: /product_details/2
              - generic [ref=e136]: 
              - text: View Product
      - generic [ref=e138]:
        - generic [ref=e139]:
          - generic [ref=e140]:
            - img "ecommerce website products" [ref=e141]
            - heading "Rs. 1000" [level=2] [ref=e142]
            - paragraph [ref=e143]: Sleeveless Dress
            - generic [ref=e144] [cursor=pointer]:
              - generic [ref=e145]: 
              - text: Add to cart
          - generic [ref=e146]:
            - heading "Rs. 1000" [level=2] [ref=e147]
            - paragraph [ref=e148]: Sleeveless Dress
            - generic [ref=e149] [cursor=pointer]:
              - generic [ref=e150]: 
              - text: Add to cart
        - list [ref=e152]:
          - listitem [ref=e153]:
            - link " View Product" [ref=e154] [cursor=pointer]:
              - /url: /product_details/3
              - generic [ref=e155]: 
              - text: View Product
      - generic [ref=e157]:
        - generic [ref=e158]:
          - generic [ref=e159]:
            - img "ecommerce website products" [ref=e160]
            - heading "Rs. 1500" [level=2] [ref=e161]
            - paragraph [ref=e162]: Stylish Dress
            - generic [ref=e163] [cursor=pointer]:
              - generic [ref=e164]: 
              - text: Add to cart
          - generic [ref=e165]:
            - heading "Rs. 1500" [level=2] [ref=e166]
            - paragraph [ref=e167]: Stylish Dress
            - generic [ref=e168] [cursor=pointer]:
              - generic [ref=e169]: 
              - text: Add to cart
        - list [ref=e171]:
          - listitem [ref=e172]:
            - link " View Product" [ref=e173] [cursor=pointer]:
              - /url: /product_details/4
              - generic [ref=e174]: 
              - text: View Product
      - generic [ref=e176]:
        - generic [ref=e177]:
          - generic [ref=e178]:
            - img "ecommerce website products" [ref=e179]
            - heading "Rs. 600" [level=2] [ref=e180]
            - paragraph [ref=e181]: Winter Top
            - generic [ref=e182] [cursor=pointer]:
              - generic [ref=e183]: 
              - text: Add to cart
          - generic [ref=e184]:
            - heading "Rs. 600" [level=2] [ref=e185]
            - paragraph [ref=e186]: Winter Top
            - generic [ref=e187] [cursor=pointer]:
              - generic [ref=e188]: 
              - text: Add to cart
        - list [ref=e190]:
          - listitem [ref=e191]:
            - link " View Product" [ref=e192] [cursor=pointer]:
              - /url: /product_details/5
              - generic [ref=e193]: 
              - text: View Product
      - generic [ref=e195]:
        - generic [ref=e196]:
          - generic [ref=e197]:
            - img "ecommerce website products" [ref=e198]
            - heading "Rs. 400" [level=2] [ref=e199]
            - paragraph [ref=e200]: Summer White Top
            - generic [ref=e201] [cursor=pointer]:
              - generic [ref=e202]: 
              - text: Add to cart
          - generic [ref=e203]:
            - heading "Rs. 400" [level=2] [ref=e204]
            - paragraph [ref=e205]: Summer White Top
            - generic [ref=e206] [cursor=pointer]:
              - generic [ref=e207]: 
              - text: Add to cart
        - list [ref=e209]:
          - listitem [ref=e210]:
            - link " View Product" [ref=e211] [cursor=pointer]:
              - /url: /product_details/6
              - generic [ref=e212]: 
              - text: View Product
      - generic [ref=e214]:
        - generic [ref=e215]:
          - generic [ref=e216]:
            - img "ecommerce website products" [ref=e217]
            - heading "Rs. 1000" [level=2] [ref=e218]
            - paragraph [ref=e219]: Madame Top For Women
            - generic [ref=e220] [cursor=pointer]:
              - generic [ref=e221]: 
              - text: Add to cart
          - generic [ref=e222]:
            - heading "Rs. 1000" [level=2] [ref=e223]
            - paragraph [ref=e224]: Madame Top For Women
            - generic [ref=e225] [cursor=pointer]:
              - generic [ref=e226]: 
              - text: Add to cart
        - list [ref=e228]:
          - listitem [ref=e229]:
            - link " View Product" [ref=e230] [cursor=pointer]:
              - /url: /product_details/7
              - generic [ref=e231]: 
              - text: View Product
      - generic [ref=e233]:
        - generic [ref=e234]:
          - generic [ref=e235]:
            - img "ecommerce website products" [ref=e236]
            - heading "Rs. 700" [level=2] [ref=e237]
            - paragraph [ref=e238]: Fancy Green Top
            - generic [ref=e239] [cursor=pointer]:
              - generic [ref=e240]: 
              - text: Add to cart
          - generic [ref=e241]:
            - heading "Rs. 700" [level=2] [ref=e242]
            - paragraph [ref=e243]: Fancy Green Top
            - generic [ref=e244] [cursor=pointer]:
              - generic [ref=e245]: 
              - text: Add to cart
        - list [ref=e247]:
          - listitem [ref=e248]:
            - link " View Product" [ref=e249] [cursor=pointer]:
              - /url: /product_details/8
              - generic [ref=e250]: 
              - text: View Product
      - generic [ref=e252]:
        - generic [ref=e253]:
          - generic [ref=e254]:
            - img "ecommerce website products" [ref=e255]
            - heading "Rs. 499" [level=2] [ref=e256]
            - paragraph [ref=e257]: Sleeves Printed Top - White
            - generic [ref=e258] [cursor=pointer]:
              - generic [ref=e259]: 
              - text: Add to cart
          - generic [ref=e260]:
            - heading "Rs. 499" [level=2] [ref=e261]
            - paragraph [ref=e262]: Sleeves Printed Top - White
            - generic [ref=e263] [cursor=pointer]:
              - generic [ref=e264]: 
              - text: Add to cart
        - list [ref=e266]:
          - listitem [ref=e267]:
            - link " View Product" [ref=e268] [cursor=pointer]:
              - /url: /product_details/11
              - generic [ref=e269]: 
              - text: View Product
      - generic [ref=e271]:
        - generic [ref=e272]:
          - generic [ref=e273]:
            - img "ecommerce website products" [ref=e274]
            - heading "Rs. 359" [level=2] [ref=e275]
            - paragraph [ref=e276]: Half Sleeves Top Schiffli Detailing - Pink
            - generic [ref=e277] [cursor=pointer]:
              - generic [ref=e278]: 
              - text: Add to cart
          - generic [ref=e279]:
            - heading "Rs. 359" [level=2] [ref=e280]
            - paragraph [ref=e281]: Half Sleeves Top Schiffli Detailing - Pink
            - generic [ref=e282] [cursor=pointer]:
              - generic [ref=e283]: 
              - text: Add to cart
        - list [ref=e285]:
          - listitem [ref=e286]:
            - link " View Product" [ref=e287] [cursor=pointer]:
              - /url: /product_details/12
              - generic [ref=e288]: 
              - text: View Product
      - generic [ref=e290]:
        - generic [ref=e291]:
          - generic [ref=e292]:
            - img "ecommerce website products" [ref=e293]
            - heading "Rs. 278" [level=2] [ref=e294]
            - paragraph [ref=e295]: Frozen Tops For Kids
            - generic [ref=e296] [cursor=pointer]:
              - generic [ref=e297]: 
              - text: Add to cart
          - generic [ref=e298]:
            - heading "Rs. 278" [level=2] [ref=e299]
            - paragraph [ref=e300]: Frozen Tops For Kids
            - generic [ref=e301] [cursor=pointer]:
              - generic [ref=e302]: 
              - text: Add to cart
        - list [ref=e304]:
          - listitem [ref=e305]:
            - link " View Product" [ref=e306] [cursor=pointer]:
              - /url: /product_details/13
              - generic [ref=e307]: 
              - text: View Product
      - generic [ref=e309]:
        - generic [ref=e310]:
          - generic [ref=e311]:
            - img "ecommerce website products" [ref=e312]
            - heading "Rs. 679" [level=2] [ref=e313]
            - paragraph [ref=e314]: Full Sleeves Top Cherry - Pink
            - generic [ref=e315] [cursor=pointer]:
              - generic [ref=e316]: 
              - text: Add to cart
          - generic [ref=e317]:
            - heading "Rs. 679" [level=2] [ref=e318]
            - paragraph [ref=e319]: Full Sleeves Top Cherry - Pink
            - generic [ref=e320] [cursor=pointer]:
              - generic [ref=e321]: 
              - text: Add to cart
        - list [ref=e323]:
          - listitem [ref=e324]:
            - link " View Product" [ref=e325] [cursor=pointer]:
              - /url: /product_details/14
              - generic [ref=e326]: 
              - text: View Product
      - generic [ref=e328]:
        - generic [ref=e329]:
          - generic [ref=e330]:
            - img "ecommerce website products" [ref=e331]
            - heading "Rs. 315" [level=2] [ref=e332]
            - paragraph [ref=e333]: Printed Off Shoulder Top - White
            - generic [ref=e334] [cursor=pointer]:
              - generic [ref=e335]: 
              - text: Add to cart
          - generic [ref=e336]:
            - heading "Rs. 315" [level=2] [ref=e337]
            - paragraph [ref=e338]: Printed Off Shoulder Top - White
            - generic [ref=e339] [cursor=pointer]:
              - generic [ref=e340]: 
              - text: Add to cart
        - list [ref=e342]:
          - listitem [ref=e343]:
            - link " View Product" [ref=e344] [cursor=pointer]:
              - /url: /product_details/15
              - generic [ref=e345]: 
              - text: View Product
      - generic [ref=e347]:
        - generic [ref=e348]:
          - generic [ref=e349]:
            - img "ecommerce website products" [ref=e350]
            - heading "Rs. 478" [level=2] [ref=e351]
            - paragraph [ref=e352]: Sleeves Top and Short - Blue & Pink
            - generic [ref=e353] [cursor=pointer]:
              - generic [ref=e354]: 
              - text: Add to cart
          - generic [ref=e355]:
            - heading "Rs. 478" [level=2] [ref=e356]
            - paragraph [ref=e357]: Sleeves Top and Short - Blue & Pink
            - generic [ref=e358] [cursor=pointer]:
              - generic [ref=e359]: 
              - text: Add to cart
        - list [ref=e361]:
          - listitem [ref=e362]:
            - link " View Product" [ref=e363] [cursor=pointer]:
              - /url: /product_details/16
              - generic [ref=e364]: 
              - text: View Product
      - generic [ref=e366]:
        - generic [ref=e367]:
          - generic [ref=e368]:
            - img "ecommerce website products" [ref=e369]
            - heading "Rs. 1200" [level=2] [ref=e370]
            - paragraph [ref=e371]: Little Girls Mr. Panda Shirt
            - generic [ref=e372] [cursor=pointer]:
              - generic [ref=e373]: 
              - text: Add to cart
          - generic [ref=e374]:
            - heading "Rs. 1200" [level=2] [ref=e375]
            - paragraph [ref=e376]: Little Girls Mr. Panda Shirt
            - generic [ref=e377] [cursor=pointer]:
              - generic [ref=e378]: 
              - text: Add to cart
        - list [ref=e380]:
          - listitem [ref=e381]:
            - link " View Product" [ref=e382] [cursor=pointer]:
              - /url: /product_details/18
              - generic [ref=e383]: 
              - text: View Product
      - generic [ref=e385]:
        - generic [ref=e386]:
          - generic [ref=e387]:
            - img "ecommerce website products" [ref=e388]
            - heading "Rs. 1050" [level=2] [ref=e389]
            - paragraph [ref=e390]: Sleeveless Unicorn Patch Gown - Pink
            - generic [ref=e391] [cursor=pointer]:
              - generic [ref=e392]: 
              - text: Add to cart
          - generic [ref=e393]:
            - heading "Rs. 1050" [level=2] [ref=e394]
            - paragraph [ref=e395]: Sleeveless Unicorn Patch Gown - Pink
            - generic [ref=e396] [cursor=pointer]:
              - generic [ref=e397]: 
              - text: Add to cart
        - list [ref=e399]:
          - listitem [ref=e400]:
            - link " View Product" [ref=e401] [cursor=pointer]:
              - /url: /product_details/19
              - generic [ref=e402]: 
              - text: View Product
      - generic [ref=e404]:
        - generic [ref=e405]:
          - generic [ref=e406]:
            - img "ecommerce website products" [ref=e407]
            - heading "Rs. 1190" [level=2] [ref=e408]
            - paragraph [ref=e409]: Cotton Mull Embroidered Dress
            - generic [ref=e410] [cursor=pointer]:
              - generic [ref=e411]: 
              - text: Add to cart
          - generic [ref=e412]:
            - heading "Rs. 1190" [level=2] [ref=e413]
            - paragraph [ref=e414]: Cotton Mull Embroidered Dress
            - generic [ref=e415] [cursor=pointer]:
              - generic [ref=e416]: 
              - text: Add to cart
        - list [ref=e418]:
          - listitem [ref=e419]:
            - link " View Product" [ref=e420] [cursor=pointer]:
              - /url: /product_details/20
              - generic [ref=e421]: 
              - text: View Product
      - generic [ref=e423]:
        - generic [ref=e424]:
          - generic [ref=e425]:
            - img "ecommerce website products" [ref=e426]
            - heading "Rs. 1530" [level=2] [ref=e427]
            - paragraph [ref=e428]: Blue Cotton Indie Mickey Dress
            - generic [ref=e429] [cursor=pointer]:
              - generic [ref=e430]: 
              - text: Add to cart
          - generic [ref=e431]:
            - heading "Rs. 1530" [level=2] [ref=e432]
            - paragraph [ref=e433]: Blue Cotton Indie Mickey Dress
            - generic [ref=e434] [cursor=pointer]:
              - generic [ref=e435]: 
              - text: Add to cart
        - list [ref=e437]:
          - listitem [ref=e438]:
            - link " View Product" [ref=e439] [cursor=pointer]:
              - /url: /product_details/21
              - generic [ref=e440]: 
              - text: View Product
      - generic [ref=e442]:
        - generic [ref=e443]:
          - generic [ref=e444]:
            - img "ecommerce website products" [ref=e445]
            - heading "Rs. 1600" [level=2] [ref=e446]
            - paragraph [ref=e447]: Long Maxi Tulle Fancy Dress Up Outfits -Pink
            - generic [ref=e448] [cursor=pointer]:
              - generic [ref=e449]: 
              - text: Add to cart
          - generic [ref=e450]:
            - heading "Rs. 1600" [level=2] [ref=e451]
            - paragraph [ref=e452]: Long Maxi Tulle Fancy Dress Up Outfits -Pink
            - generic [ref=e453] [cursor=pointer]:
              - generic [ref=e454]: 
              - text: Add to cart
        - list [ref=e456]:
          - listitem [ref=e457]:
            - link " View Product" [ref=e458] [cursor=pointer]:
              - /url: /product_details/22
              - generic [ref=e459]: 
              - text: View Product
      - generic [ref=e461]:
        - generic [ref=e462]:
          - generic [ref=e463]:
            - img "ecommerce website products" [ref=e464]
            - heading "Rs. 1100" [level=2] [ref=e465]
            - paragraph [ref=e466]: Sleeveless Unicorn Print Fit & Flare Net Dress - Multi
            - generic [ref=e467] [cursor=pointer]:
              - generic [ref=e468]: 
              - text: Add to cart
          - generic [ref=e469]:
            - heading "Rs. 1100" [level=2] [ref=e470]
            - paragraph [ref=e471]: Sleeveless Unicorn Print Fit & Flare Net Dress - Multi
            - generic [ref=e472] [cursor=pointer]:
              - generic [ref=e473]: 
              - text: Add to cart
        - list [ref=e475]:
          - listitem [ref=e476]:
            - link " View Product" [ref=e477] [cursor=pointer]:
              - /url: /product_details/23
              - generic [ref=e478]: 
              - text: View Product
      - generic [ref=e480]:
        - generic [ref=e481]:
          - generic [ref=e482]:
            - img "ecommerce website products" [ref=e483]
            - heading "Rs. 849" [level=2] [ref=e484]
            - paragraph [ref=e485]: Colour Blocked Shirt – Sky Blue
            - generic [ref=e486] [cursor=pointer]:
              - generic [ref=e487]: 
              - text: Add to cart
          - generic [ref=e488]:
            - heading "Rs. 849" [level=2] [ref=e489]
            - paragraph [ref=e490]: Colour Blocked Shirt – Sky Blue
            - generic [ref=e491] [cursor=pointer]:
              - generic [ref=e492]: 
              - text: Add to cart
        - list [ref=e494]:
          - listitem [ref=e495]:
            - link " View Product" [ref=e496] [cursor=pointer]:
              - /url: /product_details/24
              - generic [ref=e497]: 
              - text: View Product
      - generic [ref=e499]:
        - generic [ref=e500]:
          - generic [ref=e501]:
            - img "ecommerce website products" [ref=e502]
            - heading "Rs. 1299" [level=2] [ref=e503]
            - paragraph [ref=e504]: Pure Cotton V-Neck T-Shirt
            - generic [ref=e505] [cursor=pointer]:
              - generic [ref=e506]: 
              - text: Add to cart
          - generic [ref=e507]:
            - heading "Rs. 1299" [level=2] [ref=e508]
            - paragraph [ref=e509]: Pure Cotton V-Neck T-Shirt
            - generic [ref=e510] [cursor=pointer]:
              - generic [ref=e511]: 
              - text: Add to cart
        - list [ref=e513]:
          - listitem [ref=e514]:
            - link " View Product" [ref=e515] [cursor=pointer]:
              - /url: /product_details/28
              - generic [ref=e516]: 
              - text: View Product
      - generic [ref=e518]:
        - generic [ref=e519]:
          - generic [ref=e520]:
            - img "ecommerce website products" [ref=e521]
            - heading "Rs. 1000" [level=2] [ref=e522]
            - paragraph [ref=e523]: Green Side Placket Detail T-Shirt
            - generic [ref=e524] [cursor=pointer]:
              - generic [ref=e525]: 
              - text: Add to cart
          - generic [ref=e526]:
            - heading "Rs. 1000" [level=2] [ref=e527]
            - paragraph [ref=e528]: Green Side Placket Detail T-Shirt
            - generic [ref=e529] [cursor=pointer]:
              - generic [ref=e530]: 
              - text: Add to cart
        - list [ref=e532]:
          - listitem [ref=e533]:
            - link " View Product" [ref=e534] [cursor=pointer]:
              - /url: /product_details/29
              - generic [ref=e535]: 
              - text: View Product
      - generic [ref=e537]:
        - generic [ref=e538]:
          - generic [ref=e539]:
            - img "ecommerce website products" [ref=e540]
            - heading "Rs. 1500" [level=2] [ref=e541]
            - paragraph [ref=e542]: Premium Polo T-Shirts
            - generic [ref=e543] [cursor=pointer]:
              - generic [ref=e544]: 
              - text: Add to cart
          - generic [ref=e545]:
            - heading "Rs. 1500" [level=2] [ref=e546]
            - paragraph [ref=e547]: Premium Polo T-Shirts
            - generic [ref=e548] [cursor=pointer]:
              - generic [ref=e549]: 
              - text: Add to cart
        - list [ref=e551]:
          - listitem [ref=e552]:
            - link " View Product" [ref=e553] [cursor=pointer]:
              - /url: /product_details/30
              - generic [ref=e554]: 
              - text: View Product
      - generic [ref=e556]:
        - generic [ref=e557]:
          - generic [ref=e558]:
            - img "ecommerce website products" [ref=e559]
            - heading "Rs. 850" [level=2] [ref=e560]
            - paragraph [ref=e561]: Pure Cotton Neon Green Tshirt
            - generic [ref=e562] [cursor=pointer]:
              - generic [ref=e563]: 
              - text: Add to cart
          - generic [ref=e564]:
            - heading "Rs. 850" [level=2] [ref=e565]
            - paragraph [ref=e566]: Pure Cotton Neon Green Tshirt
            - generic [ref=e567] [cursor=pointer]:
              - generic [ref=e568]: 
              - text: Add to cart
        - list [ref=e570]:
          - listitem [ref=e571]:
            - link " View Product" [ref=e572] [cursor=pointer]:
              - /url: /product_details/31
              - generic [ref=e573]: 
              - text: View Product
      - generic [ref=e575]:
        - generic [ref=e576]:
          - generic [ref=e577]:
            - img "ecommerce website products" [ref=e578]
            - heading "Rs. 799" [level=2] [ref=e579]
            - paragraph [ref=e580]: Soft Stretch Jeans
            - generic [ref=e581] [cursor=pointer]:
              - generic [ref=e582]: 
              - text: Add to cart
          - generic [ref=e583]:
            - heading "Rs. 799" [level=2] [ref=e584]
            - paragraph [ref=e585]: Soft Stretch Jeans
            - generic [ref=e586] [cursor=pointer]:
              - generic [ref=e587]: 
              - text: Add to cart
        - list [ref=e589]:
          - listitem [ref=e590]:
            - link " View Product" [ref=e591] [cursor=pointer]:
              - /url: /product_details/33
              - generic [ref=e592]: 
              - text: View Product
      - generic [ref=e594]:
        - generic [ref=e595]:
          - generic [ref=e596]:
            - img "ecommerce website products" [ref=e597]
            - heading "Rs. 1200" [level=2] [ref=e598]
            - paragraph [ref=e599]: Regular Fit Straight Jeans
            - generic [ref=e600] [cursor=pointer]:
              - generic [ref=e601]: 
              - text: Add to cart
          - generic [ref=e602]:
            - heading "Rs. 1200" [level=2] [ref=e603]
            - paragraph [ref=e604]: Regular Fit Straight Jeans
            - generic [ref=e605] [cursor=pointer]:
              - generic [ref=e606]: 
              - text: Add to cart
        - list [ref=e608]:
          - listitem [ref=e609]:
            - link " View Product" [ref=e610] [cursor=pointer]:
              - /url: /product_details/35
              - generic [ref=e611]: 
              - text: View Product
      - generic [ref=e613]:
        - generic [ref=e614]:
          - generic [ref=e615]:
            - img "ecommerce website products" [ref=e616]
            - heading "Rs. 1400" [level=2] [ref=e617]
            - paragraph [ref=e618]: Grunt Blue Slim Fit Jeans
            - generic [ref=e619] [cursor=pointer]:
              - generic [ref=e620]: 
              - text: Add to cart
          - generic [ref=e621]:
            - heading "Rs. 1400" [level=2] [ref=e622]
            - paragraph [ref=e623]: Grunt Blue Slim Fit Jeans
            - generic [ref=e624] [cursor=pointer]:
              - generic [ref=e625]: 
              - text: Add to cart
        - list [ref=e627]:
          - listitem [ref=e628]:
            - link " View Product" [ref=e629] [cursor=pointer]:
              - /url: /product_details/37
              - generic [ref=e630]: 
              - text: View Product
      - generic [ref=e632]:
        - generic [ref=e633]:
          - generic [ref=e634]:
            - img "ecommerce website products" [ref=e635]
            - heading "Rs. 2300" [level=2] [ref=e636]
            - paragraph [ref=e637]: Rose Pink Embroidered Maxi Dress
            - generic [ref=e638] [cursor=pointer]:
              - generic [ref=e639]: 
              - text: Add to cart
          - generic [ref=e640]:
            - heading "Rs. 2300" [level=2] [ref=e641]
            - paragraph [ref=e642]: Rose Pink Embroidered Maxi Dress
            - generic [ref=e643] [cursor=pointer]:
              - generic [ref=e644]: 
              - text: Add to cart
        - list [ref=e646]:
          - listitem [ref=e647]:
            - link " View Product" [ref=e648] [cursor=pointer]:
              - /url: /product_details/38
              - generic [ref=e649]: 
              - text: View Product
      - generic [ref=e651]:
        - generic [ref=e652]:
          - generic [ref=e653]:
            - img "ecommerce website products" [ref=e654]
            - heading "Rs. 3000" [level=2] [ref=e655]
            - paragraph [ref=e656]: Cotton Silk Hand Block Print Saree
            - generic [ref=e657] [cursor=pointer]:
              - generic [ref=e658]: 
              - text: Add to cart
          - generic [ref=e659]:
            - heading "Rs. 3000" [level=2] [ref=e660]
            - paragraph [ref=e661]: Cotton Silk Hand Block Print Saree
            - generic [ref=e662] [cursor=pointer]:
              - generic [ref=e663]: 
              - text: Add to cart
        - list [ref=e665]:
          - listitem [ref=e666]:
            - link " View Product" [ref=e667] [cursor=pointer]:
              - /url: /product_details/39
              - generic [ref=e668]: 
              - text: View Product
      - generic [ref=e670]:
        - generic [ref=e671]:
          - generic [ref=e672]:
            - img "ecommerce website products" [ref=e673]
            - heading "Rs. 3500" [level=2] [ref=e674]
            - paragraph [ref=e675]: Rust Red Linen Saree
            - generic [ref=e676] [cursor=pointer]:
              - generic [ref=e677]: 
              - text: Add to cart
          - generic [ref=e678]:
            - heading "Rs. 3500" [level=2] [ref=e679]
            - paragraph [ref=e680]: Rust Red Linen Saree
            - generic [ref=e681] [cursor=pointer]:
              - generic [ref=e682]: 
              - text: Add to cart
        - list [ref=e684]:
          - listitem [ref=e685]:
            - link " View Product" [ref=e686] [cursor=pointer]:
              - /url: /product_details/40
              - generic [ref=e687]: 
              - text: View Product
      - generic [ref=e689]:
        - generic [ref=e690]:
          - generic [ref=e691]:
            - img "ecommerce website products" [ref=e692]
            - heading "Rs. 5000" [level=2] [ref=e693]
            - paragraph [ref=e694]: Beautiful Peacock Blue Cotton Linen Saree
            - generic [ref=e695] [cursor=pointer]:
              - generic [ref=e696]: 
              - text: Add to cart
          - generic [ref=e697]:
            - heading "Rs. 5000" [level=2] [ref=e698]
            - paragraph [ref=e699]: Beautiful Peacock Blue Cotton Linen Saree
            - generic [ref=e700] [cursor=pointer]:
              - generic [ref=e701]: 
              - text: Add to cart
        - list [ref=e703]:
          - listitem [ref=e704]:
            - link " View Product" [ref=e705] [cursor=pointer]:
              - /url: /product_details/41
              - generic [ref=e706]: 
              - text: View Product
      - generic [ref=e708]:
        - generic [ref=e709]:
          - generic [ref=e710]:
            - img "ecommerce website products" [ref=e711]
            - heading "Rs. 1400" [level=2] [ref=e712]
            - paragraph [ref=e713]: Lace Top For Women
            - generic [ref=e714] [cursor=pointer]:
              - generic [ref=e715]: 
              - text: Add to cart
          - generic [ref=e716]:
            - heading "Rs. 1400" [level=2] [ref=e717]
            - paragraph [ref=e718]: Lace Top For Women
            - generic [ref=e719] [cursor=pointer]:
              - generic [ref=e720]: 
              - text: Add to cart
        - list [ref=e722]:
          - listitem [ref=e723]:
            - link " View Product" [ref=e724] [cursor=pointer]:
              - /url: /product_details/42
              - generic [ref=e725]: 
              - text: View Product
      - generic [ref=e727]:
        - generic [ref=e728]:
          - generic [ref=e729]:
            - img "ecommerce website products" [ref=e730]
            - heading "Rs. 1389" [level=2] [ref=e731]
            - paragraph [ref=e732]: GRAPHIC DESIGN MEN T SHIRT - BLUE
            - generic [ref=e733] [cursor=pointer]:
              - generic [ref=e734]: 
              - text: Add to cart
          - generic [ref=e735]:
            - heading "Rs. 1389" [level=2] [ref=e736]
            - paragraph [ref=e737]: GRAPHIC DESIGN MEN T SHIRT - BLUE
            - generic [ref=e738] [cursor=pointer]:
              - generic [ref=e739]: 
              - text: Add to cart
        - list [ref=e741]:
          - listitem [ref=e742]:
            - link " View Product" [ref=e743] [cursor=pointer]:
              - /url: /product_details/43
              - generic [ref=e744]: 
              - text: View Product
  - contentinfo [ref=e745]:
    - generic [ref=e750]:
      - heading "Subscription" [level=2] [ref=e751]
      - generic [ref=e752]:
        - textbox "Your email address" [ref=e753]
        - button "" [ref=e754] [cursor=pointer]
        - paragraph [ref=e756]: Get the most recent updates from our site and be updated your self...
    - paragraph [ref=e760]: Copyright © 2021 All rights reserved
  - link "" [ref=e761] [cursor=pointer]:
    - /url: "#top"
```

# Test source

```ts
  1   | import { type Locator, type Page } from "@playwright/test";
  2   | 
  3   | /**
  4   |  * The consent banner is stored per browser context after the first acceptance,
  5   |  * so re-checking on every navigation would cost a timeout per call for nothing.
  6   |  */
  7   | const consentHandled = new WeakSet<Page>();
  8   | 
  9   | export abstract class BaseAppPage {
  10  |   readonly page: Page;
  11  |   readonly header: Locator;
  12  |   readonly cartLink: Locator;
  13  |   readonly signupLoginLink: Locator;
  14  |   readonly contactUsLink: Locator;
  15  |   readonly logoutLink: Locator;
  16  |   readonly deleteAccountLink: Locator;
  17  |   readonly loggedInAs: Locator;
  18  |   readonly consentButton: Locator;
  19  | 
  20  |   constructor(page: Page) {
  21  |     this.page = page;
  22  |     this.header = page.locator("#header");
  23  |     this.cartLink = page.getByRole("link", { name: "Cart", exact: true });
  24  |     this.signupLoginLink = page.getByRole("link", { name: "Signup / Login" });
  25  |     this.contactUsLink = page.getByRole("link", { name: "Contact us" });
  26  |     this.logoutLink = page.getByRole("link", { name: "Logout" });
  27  |     this.deleteAccountLink = page.getByRole("link", { name: "Delete Account" });
  28  |     this.loggedInAs = page.getByText("Logged in as");
  29  |     this.consentButton = page.getByRole("button", { name: "Consent" });
  30  |   }
  31  | 
  32  |   protected async goto(path: string): Promise<void> {
  33  |     await this.page.goto(path);
  34  |     await this.dismissConsentIfPresent();
  35  |   }
  36  | 
  37  |   /**
  38  |    * The banner renders inside a shadow root, which Playwright locators pierce
  39  |    * but document.querySelector does not.
  40  |    */
  41  |   async dismissConsentIfPresent(): Promise<void> {
  42  |     if (consentHandled.has(this.page)) {
  43  |       return;
  44  |     }
  45  | 
  46  |     try {
  47  |       await this.consentButton.waitFor({ state: "visible", timeout: 3_000 });
  48  |       await this.consentButton.click();
  49  |       await this.consentButton.waitFor({ state: "hidden", timeout: 5_000 });
  50  |     } catch {
  51  |       // Banner never appeared: third-party consent script blocked or already accepted.
  52  |     }
  53  | 
  54  |     consentHandled.add(this.page);
  55  |   }
  56  | 
  57  |   /**
  58  |    * Resolves once every image inside the scope has finished decoding.
  59  |    *
  60  |    * Product photography streams in after load, so a region containing it keeps
  61  |    * reflowing as each image arrives. A screenshot assertion waits for its
  62  |    * target to be stable, and under parallel load the images can still be
  63  |    * arriving when that wait expires, the capture then fails on stability
  64  |    * rather than on any visual difference. Waiting for the images themselves
  65  |    * fixes the cause; raising the screenshot timeout would only move the
  66  |    * deadline. Images that fail to load settle through their error event, so a
  67  |    * broken one cannot hang this.
  68  |    */
  69  |   async waitForImagesLoaded(scope: Locator): Promise<void> {
> 70  |     await scope.evaluate(async (element: HTMLElement) => {
      |                 ^ Error: locator.evaluate: Test timeout of 60000ms exceeded.
  71  |       const images: HTMLImageElement[] = Array.from(
  72  |         element.querySelectorAll("img"),
  73  |       );
  74  |       await Promise.all(
  75  |         images.map((image) =>
  76  |           image.complete && image.naturalWidth > 0
  77  |             ? Promise.resolve()
  78  |             : new Promise((resolve) => {
  79  |                 image.addEventListener("load", resolve, { once: true });
  80  |                 image.addEventListener("error", resolve, { once: true });
  81  |               }),
  82  |         ),
  83  |       );
  84  |     });
  85  |   }
  86  | 
  87  |   /**
  88  |    * Aligns an element to the top of the viewport.
  89  |    *
  90  |    * `scrollIntoViewIfNeeded` scrolls the minimum distance required, so where it
  91  |    * lands depends on where the page already was. A visual capture of the
  92  |    * viewport needs the same framing every run, which this guarantees.
  93  |    */
  94  |   async scrollToTop(target: Locator): Promise<void> {
  95  |     await target.evaluate((element: Element) =>
  96  |       element.scrollIntoView({ block: "start", behavior: "instant" }),
  97  |     );
  98  |   }
  99  | 
  100 |   async logout(): Promise<void> {
  101 |     await this.logoutLink.click();
  102 |   }
  103 | 
  104 |   async deleteAccount(): Promise<void> {
  105 |     await this.deleteAccountLink.click();
  106 |   }
  107 | }
  108 | 
```