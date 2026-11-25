# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: vr-tests/home.vr.spec.ts >> Visual regression - Home Page >> VR-09: Footer bar
- Location: vr-tests/home.vr.spec.ts:117:3

# Error details

```
Error: expect(locator).toHaveScreenshot(expected) failed

Locator: locator('.footer-bottom')
  2599 pixels (ratio 0.04 of all image pixels) are different.

  Snapshot: home-footer.png

Call log:
  - Expect "toHaveScreenshot(home-footer.png)" locator('.footer-bottom') with timeout 5000ms
    - verifying given screenshot expectation
  - waiting for locator('.footer-bottom')
    - locator resolved to <div class="footer-bottom">…</div>
  - taking element screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - attempting scroll into view action
    - waiting for element to be stable
  - 1878 pixels (ratio 0.03 of all image pixels) are different.
  - waiting 100ms before taking screenshot
  - waiting for locator('.footer-bottom')
    - locator resolved to <div class="footer-bottom">…</div>
  - taking element screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - attempting scroll into view action
    - waiting for element to be stable
  - 1461 pixels (ratio 0.02 of all image pixels) are different.
  - waiting 250ms before taking screenshot
  - waiting for locator('.footer-bottom')
    - locator resolved to <div class="footer-bottom">…</div>
  - taking element screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - attempting scroll into view action
    - waiting for element to be stable
  - 2286 pixels (ratio 0.03 of all image pixels) are different.
  - waiting 500ms before taking screenshot
  - waiting for locator('.footer-bottom')
    - locator resolved to <div class="footer-bottom">…</div>
  - taking element screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - attempting scroll into view action
    - waiting for element to be stable
  - captured a stable screenshot
  - 2599 pixels (ratio 0.04 of all image pixels) are different.

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
          - link " Logout" [ref=e23] [cursor=pointer]:
            - /url: /logout
            - generic [ref=e24]: 
            - text: Logout
        - listitem [ref=e25]:
          - link " Delete Account" [ref=e26] [cursor=pointer]:
            - /url: /delete_account
            - generic [ref=e27]: 
            - text: Delete Account
        - listitem [ref=e28]:
          - link " Test Cases" [ref=e29] [cursor=pointer]:
            - /url: /test_cases
            - generic [ref=e30]: 
            - text: Test Cases
        - listitem [ref=e31]:
          - link " API Testing" [ref=e32] [cursor=pointer]:
            - /url: /api_list
            - generic [ref=e33]: 
            - text: API Testing
        - listitem [ref=e34]:
          - link " Video Tutorials" [ref=e35] [cursor=pointer]:
            - /url: https://www.youtube.com/c/AutomationExercise
            - generic [ref=e36]: 
            - text: Video Tutorials
        - listitem [ref=e37]:
          - link " Contact us" [ref=e38] [cursor=pointer]:
            - /url: /contact_us
            - generic [ref=e39]: 
            - text: Contact us
        - listitem [ref=e40]:
          - generic [ref=e41]:
            - generic [ref=e42]: 
            - text: Logged in as Jon Doe
  - generic [ref=e47]:
    - list [ref=e48]:
      - listitem [ref=e49] [cursor=pointer]
      - listitem [ref=e50] [cursor=pointer]
      - listitem [ref=e51] [cursor=pointer]
    - generic [ref=e52]:
      - generic:
        - generic [ref=e53]:
          - heading "AutomationExercise" [level=1] [ref=e54]
          - heading "Full-Fledged practice website for Automation Engineers" [level=2] [ref=e55]
          - paragraph [ref=e56]: All QA engineers can use this website for automation practice and API testing either they are at beginner or advance level. This is for everybody to help them brush up their automation skills.
          - link [ref=e57] [cursor=pointer]:
            - /url: /test_cases
            - button "Test Cases" [ref=e58]
          - link [ref=e59] [cursor=pointer]:
            - /url: /api_list
            - button "APIs list for practice" [ref=e60]
        - img "demo website for practice" [ref=e62]
    - link "" [ref=e63] [cursor=pointer]:
      - /url: "#slider-carousel"
    - link "" [ref=e65] [cursor=pointer]:
      - /url: "#slider-carousel"
  - generic [ref=e69]:
    - generic [ref=e71]:
      - heading "Category" [level=2] [ref=e72]
      - generic [ref=e73]:
        - heading [level=4] [ref=e76]:
          - link " Women" [ref=e77] [cursor=pointer]:
            - /url: "#Women"
            - generic [ref=e78]: 
            - text: Women
        - heading [level=4] [ref=e82]:
          - link " Men" [ref=e83] [cursor=pointer]:
            - /url: "#Men"
            - generic [ref=e84]: 
            - text: Men
        - heading [level=4] [ref=e88]:
          - link " Kids" [ref=e89] [cursor=pointer]:
            - /url: "#Kids"
            - generic [ref=e90]: 
            - text: Kids
      - generic [ref=e92]:
        - heading "Brands" [level=2] [ref=e93]
        - list [ref=e95]:
          - listitem [ref=e96]:
            - link "(6) Polo" [ref=e97] [cursor=pointer]:
              - /url: /brand_products/Polo
              - generic [ref=e98]: (6)
              - text: Polo
          - listitem [ref=e99]:
            - link "(5) H&M" [ref=e100] [cursor=pointer]:
              - /url: /brand_products/H&M
              - generic [ref=e101]: (5)
              - text: H&M
          - listitem [ref=e102]:
            - link "(5) Madame" [ref=e103] [cursor=pointer]:
              - /url: /brand_products/Madame
              - generic [ref=e104]: (5)
              - text: Madame
          - listitem [ref=e105]:
            - link "(3) Mast & Harbour" [ref=e106] [cursor=pointer]:
              - /url: /brand_products/Mast & Harbour
              - generic [ref=e107]: (3)
              - text: Mast & Harbour
          - listitem [ref=e108]:
            - link "(4) Babyhug" [ref=e109] [cursor=pointer]:
              - /url: /brand_products/Babyhug
              - generic [ref=e110]: (4)
              - text: Babyhug
          - listitem [ref=e111]:
            - link "(3) Allen Solly Junior" [ref=e112] [cursor=pointer]:
              - /url: /brand_products/Allen Solly Junior
              - generic [ref=e113]: (3)
              - text: Allen Solly Junior
          - listitem [ref=e114]:
            - link "(3) Kookie Kids" [ref=e115] [cursor=pointer]:
              - /url: /brand_products/Kookie Kids
              - generic [ref=e116]: (3)
              - text: Kookie Kids
          - listitem [ref=e117]:
            - link "(5) Biba" [ref=e118] [cursor=pointer]:
              - /url: /brand_products/Biba
              - generic [ref=e119]: (5)
              - text: Biba
    - generic [ref=e120]:
      - generic [ref=e121]:
        - heading "Features Items" [level=2] [ref=e122]
        - generic [ref=e124]:
          - generic [ref=e125]:
            - generic [ref=e126]:
              - img "ecommerce website products" [ref=e127]
              - heading "Rs. 500" [level=2] [ref=e128]
              - paragraph [ref=e129]: Blue Top
              - generic [ref=e130] [cursor=pointer]:
                - generic [ref=e131]: 
                - text: Add to cart
            - generic [ref=e132]:
              - heading "Rs. 500" [level=2] [ref=e133]
              - paragraph [ref=e134]: Blue Top
              - generic [ref=e135] [cursor=pointer]:
                - generic [ref=e136]: 
                - text: Add to cart
          - list [ref=e138]:
            - listitem [ref=e139]:
              - link " View Product" [ref=e140] [cursor=pointer]:
                - /url: /product_details/1
                - generic [ref=e141]: 
                - text: View Product
        - generic [ref=e143]:
          - generic [ref=e144]:
            - generic [ref=e145]:
              - img "ecommerce website products" [ref=e146]
              - heading "Rs. 400" [level=2] [ref=e147]
              - paragraph [ref=e148]: Men Tshirt
              - generic [ref=e149] [cursor=pointer]:
                - generic [ref=e150]: 
                - text: Add to cart
            - generic [ref=e151]:
              - heading "Rs. 400" [level=2] [ref=e152]
              - paragraph [ref=e153]: Men Tshirt
              - generic [ref=e154] [cursor=pointer]:
                - generic [ref=e155]: 
                - text: Add to cart
          - list [ref=e157]:
            - listitem [ref=e158]:
              - link " View Product" [ref=e159] [cursor=pointer]:
                - /url: /product_details/2
                - generic [ref=e160]: 
                - text: View Product
        - generic [ref=e162]:
          - generic [ref=e163]:
            - generic [ref=e164]:
              - img "ecommerce website products" [ref=e165]
              - heading "Rs. 1000" [level=2] [ref=e166]
              - paragraph [ref=e167]: Sleeveless Dress
              - generic [ref=e168] [cursor=pointer]:
                - generic [ref=e169]: 
                - text: Add to cart
            - generic [ref=e170]:
              - heading "Rs. 1000" [level=2] [ref=e171]
              - paragraph [ref=e172]: Sleeveless Dress
              - generic [ref=e173] [cursor=pointer]:
                - generic [ref=e174]: 
                - text: Add to cart
          - list [ref=e176]:
            - listitem [ref=e177]:
              - link " View Product" [ref=e178] [cursor=pointer]:
                - /url: /product_details/3
                - generic [ref=e179]: 
                - text: View Product
        - generic [ref=e181]:
          - generic [ref=e182]:
            - generic [ref=e183]:
              - img "ecommerce website products" [ref=e184]
              - heading "Rs. 1500" [level=2] [ref=e185]
              - paragraph [ref=e186]: Stylish Dress
              - generic [ref=e187] [cursor=pointer]:
                - generic [ref=e188]: 
                - text: Add to cart
            - generic [ref=e189]:
              - heading "Rs. 1500" [level=2] [ref=e190]
              - paragraph [ref=e191]: Stylish Dress
              - generic [ref=e192] [cursor=pointer]:
                - generic [ref=e193]: 
                - text: Add to cart
          - list [ref=e195]:
            - listitem [ref=e196]:
              - link " View Product" [ref=e197] [cursor=pointer]:
                - /url: /product_details/4
                - generic [ref=e198]: 
                - text: View Product
        - generic [ref=e200]:
          - generic [ref=e201]:
            - generic [ref=e202]:
              - img "ecommerce website products" [ref=e203]
              - heading "Rs. 600" [level=2] [ref=e204]
              - paragraph [ref=e205]: Winter Top
              - generic [ref=e206] [cursor=pointer]:
                - generic [ref=e207]: 
                - text: Add to cart
            - generic [ref=e208]:
              - heading "Rs. 600" [level=2] [ref=e209]
              - paragraph [ref=e210]: Winter Top
              - generic [ref=e211] [cursor=pointer]:
                - generic [ref=e212]: 
                - text: Add to cart
          - list [ref=e214]:
            - listitem [ref=e215]:
              - link " View Product" [ref=e216] [cursor=pointer]:
                - /url: /product_details/5
                - generic [ref=e217]: 
                - text: View Product
        - generic [ref=e219]:
          - generic [ref=e220]:
            - generic [ref=e221]:
              - img "ecommerce website products" [ref=e222]
              - heading "Rs. 400" [level=2] [ref=e223]
              - paragraph [ref=e224]: Summer White Top
              - generic [ref=e225] [cursor=pointer]:
                - generic [ref=e226]: 
                - text: Add to cart
            - generic [ref=e227]:
              - heading "Rs. 400" [level=2] [ref=e228]
              - paragraph [ref=e229]: Summer White Top
              - generic [ref=e230] [cursor=pointer]:
                - generic [ref=e231]: 
                - text: Add to cart
          - list [ref=e233]:
            - listitem [ref=e234]:
              - link " View Product" [ref=e235] [cursor=pointer]:
                - /url: /product_details/6
                - generic [ref=e236]: 
                - text: View Product
        - generic [ref=e238]:
          - generic [ref=e239]:
            - generic [ref=e240]:
              - img "ecommerce website products" [ref=e241]
              - heading "Rs. 1000" [level=2] [ref=e242]
              - paragraph [ref=e243]: Madame Top For Women
              - generic [ref=e244] [cursor=pointer]:
                - generic [ref=e245]: 
                - text: Add to cart
            - generic [ref=e246]:
              - heading "Rs. 1000" [level=2] [ref=e247]
              - paragraph [ref=e248]: Madame Top For Women
              - generic [ref=e249] [cursor=pointer]:
                - generic [ref=e250]: 
                - text: Add to cart
          - list [ref=e252]:
            - listitem [ref=e253]:
              - link " View Product" [ref=e254] [cursor=pointer]:
                - /url: /product_details/7
                - generic [ref=e255]: 
                - text: View Product
        - generic [ref=e257]:
          - generic [ref=e258]:
            - generic [ref=e259]:
              - img "ecommerce website products" [ref=e260]
              - heading "Rs. 700" [level=2] [ref=e261]
              - paragraph [ref=e262]: Fancy Green Top
              - generic [ref=e263] [cursor=pointer]:
                - generic [ref=e264]: 
                - text: Add to cart
            - generic [ref=e265]:
              - heading "Rs. 700" [level=2] [ref=e266]
              - paragraph [ref=e267]: Fancy Green Top
              - generic [ref=e268] [cursor=pointer]:
                - generic [ref=e269]: 
                - text: Add to cart
          - list [ref=e271]:
            - listitem [ref=e272]:
              - link " View Product" [ref=e273] [cursor=pointer]:
                - /url: /product_details/8
                - generic [ref=e274]: 
                - text: View Product
        - generic [ref=e276]:
          - generic [ref=e277]:
            - generic [ref=e278]:
              - img "ecommerce website products"
              - heading "Rs. 499" [level=2] [ref=e279]
              - paragraph [ref=e280]: Sleeves Printed Top - White
              - generic [ref=e281] [cursor=pointer]:
                - generic [ref=e282]: 
                - text: Add to cart
            - generic [ref=e283]:
              - heading "Rs. 499" [level=2] [ref=e284]
              - paragraph [ref=e285]: Sleeves Printed Top - White
              - generic [ref=e286] [cursor=pointer]:
                - generic [ref=e287]: 
                - text: Add to cart
          - list [ref=e289]:
            - listitem [ref=e290]:
              - link " View Product" [ref=e291] [cursor=pointer]:
                - /url: /product_details/11
                - generic [ref=e292]: 
                - text: View Product
        - generic [ref=e294]:
          - generic [ref=e295]:
            - generic [ref=e296]:
              - img "ecommerce website products" [ref=e297]
              - heading "Rs. 359" [level=2] [ref=e298]
              - paragraph [ref=e299]: Half Sleeves Top Schiffli Detailing - Pink
              - generic [ref=e300] [cursor=pointer]:
                - generic [ref=e301]: 
                - text: Add to cart
            - generic [ref=e302]:
              - heading "Rs. 359" [level=2] [ref=e303]
              - paragraph [ref=e304]: Half Sleeves Top Schiffli Detailing - Pink
              - generic [ref=e305] [cursor=pointer]:
                - generic [ref=e306]: 
                - text: Add to cart
          - list [ref=e308]:
            - listitem [ref=e309]:
              - link " View Product" [ref=e310] [cursor=pointer]:
                - /url: /product_details/12
                - generic [ref=e311]: 
                - text: View Product
        - generic [ref=e313]:
          - generic [ref=e314]:
            - generic [ref=e315]:
              - img "ecommerce website products" [ref=e316]
              - heading "Rs. 278" [level=2] [ref=e317]
              - paragraph [ref=e318]: Frozen Tops For Kids
              - generic [ref=e319] [cursor=pointer]:
                - generic [ref=e320]: 
                - text: Add to cart
            - generic [ref=e321]:
              - heading "Rs. 278" [level=2] [ref=e322]
              - paragraph [ref=e323]: Frozen Tops For Kids
              - generic [ref=e324] [cursor=pointer]:
                - generic [ref=e325]: 
                - text: Add to cart
          - list [ref=e327]:
            - listitem [ref=e328]:
              - link " View Product" [ref=e329] [cursor=pointer]:
                - /url: /product_details/13
                - generic [ref=e330]: 
                - text: View Product
        - generic [ref=e332]:
          - generic [ref=e333]:
            - generic [ref=e334]:
              - img "ecommerce website products" [ref=e335]
              - heading "Rs. 679" [level=2] [ref=e336]
              - paragraph [ref=e337]: Full Sleeves Top Cherry - Pink
              - generic [ref=e338] [cursor=pointer]:
                - generic [ref=e339]: 
                - text: Add to cart
            - generic [ref=e340]:
              - heading "Rs. 679" [level=2] [ref=e341]
              - paragraph [ref=e342]: Full Sleeves Top Cherry - Pink
              - generic [ref=e343] [cursor=pointer]:
                - generic [ref=e344]: 
                - text: Add to cart
          - list [ref=e346]:
            - listitem [ref=e347]:
              - link " View Product" [ref=e348] [cursor=pointer]:
                - /url: /product_details/14
                - generic [ref=e349]: 
                - text: View Product
        - generic [ref=e351]:
          - generic [ref=e352]:
            - generic [ref=e353]:
              - img "ecommerce website products" [ref=e354]
              - heading "Rs. 315" [level=2] [ref=e355]
              - paragraph [ref=e356]: Printed Off Shoulder Top - White
              - generic [ref=e357] [cursor=pointer]:
                - generic [ref=e358]: 
                - text: Add to cart
            - generic [ref=e359]:
              - heading "Rs. 315" [level=2] [ref=e360]
              - paragraph [ref=e361]: Printed Off Shoulder Top - White
              - generic [ref=e362] [cursor=pointer]:
                - generic [ref=e363]: 
                - text: Add to cart
          - list [ref=e365]:
            - listitem [ref=e366]:
              - link " View Product" [ref=e367] [cursor=pointer]:
                - /url: /product_details/15
                - generic [ref=e368]: 
                - text: View Product
        - generic [ref=e370]:
          - generic [ref=e371]:
            - generic [ref=e372]:
              - img "ecommerce website products" [ref=e373]
              - heading "Rs. 478" [level=2] [ref=e374]
              - paragraph [ref=e375]: Sleeves Top and Short - Blue & Pink
              - generic [ref=e376] [cursor=pointer]:
                - generic [ref=e377]: 
                - text: Add to cart
            - generic [ref=e378]:
              - heading "Rs. 478" [level=2] [ref=e379]
              - paragraph [ref=e380]: Sleeves Top and Short - Blue & Pink
              - generic [ref=e381] [cursor=pointer]:
                - generic [ref=e382]: 
                - text: Add to cart
          - list [ref=e384]:
            - listitem [ref=e385]:
              - link " View Product" [ref=e386] [cursor=pointer]:
                - /url: /product_details/16
                - generic [ref=e387]: 
                - text: View Product
        - generic [ref=e389]:
          - generic [ref=e390]:
            - generic [ref=e391]:
              - img "ecommerce website products"
              - heading "Rs. 1200" [level=2] [ref=e392]
              - paragraph [ref=e393]: Little Girls Mr. Panda Shirt
              - generic [ref=e394] [cursor=pointer]:
                - generic [ref=e395]: 
                - text: Add to cart
            - generic [ref=e396]:
              - heading "Rs. 1200" [level=2] [ref=e397]
              - paragraph [ref=e398]: Little Girls Mr. Panda Shirt
              - generic [ref=e399] [cursor=pointer]:
                - generic [ref=e400]: 
                - text: Add to cart
          - list [ref=e402]:
            - listitem [ref=e403]:
              - link " View Product" [ref=e404] [cursor=pointer]:
                - /url: /product_details/18
                - generic [ref=e405]: 
                - text: View Product
        - generic [ref=e407]:
          - generic [ref=e408]:
            - generic [ref=e409]:
              - img "ecommerce website products" [ref=e410]
              - heading "Rs. 1050" [level=2] [ref=e411]
              - paragraph [ref=e412]: Sleeveless Unicorn Patch Gown - Pink
              - generic [ref=e413] [cursor=pointer]:
                - generic [ref=e414]: 
                - text: Add to cart
            - generic [ref=e415]:
              - heading "Rs. 1050" [level=2] [ref=e416]
              - paragraph [ref=e417]: Sleeveless Unicorn Patch Gown - Pink
              - generic [ref=e418] [cursor=pointer]:
                - generic [ref=e419]: 
                - text: Add to cart
          - list [ref=e421]:
            - listitem [ref=e422]:
              - link " View Product" [ref=e423] [cursor=pointer]:
                - /url: /product_details/19
                - generic [ref=e424]: 
                - text: View Product
        - generic [ref=e426]:
          - generic [ref=e427]:
            - generic [ref=e428]:
              - img "ecommerce website products" [ref=e429]
              - heading "Rs. 1190" [level=2] [ref=e430]
              - paragraph [ref=e431]: Cotton Mull Embroidered Dress
              - generic [ref=e432] [cursor=pointer]:
                - generic [ref=e433]: 
                - text: Add to cart
            - generic [ref=e434]:
              - heading "Rs. 1190" [level=2] [ref=e435]
              - paragraph [ref=e436]: Cotton Mull Embroidered Dress
              - generic [ref=e437] [cursor=pointer]:
                - generic [ref=e438]: 
                - text: Add to cart
          - list [ref=e440]:
            - listitem [ref=e441]:
              - link " View Product" [ref=e442] [cursor=pointer]:
                - /url: /product_details/20
                - generic [ref=e443]: 
                - text: View Product
        - generic [ref=e445]:
          - generic [ref=e446]:
            - generic [ref=e447]:
              - img "ecommerce website products" [ref=e448]
              - heading "Rs. 1530" [level=2] [ref=e449]
              - paragraph [ref=e450]: Blue Cotton Indie Mickey Dress
              - generic [ref=e451] [cursor=pointer]:
                - generic [ref=e452]: 
                - text: Add to cart
            - generic [ref=e453]:
              - heading "Rs. 1530" [level=2] [ref=e454]
              - paragraph [ref=e455]: Blue Cotton Indie Mickey Dress
              - generic [ref=e456] [cursor=pointer]:
                - generic [ref=e457]: 
                - text: Add to cart
          - list [ref=e459]:
            - listitem [ref=e460]:
              - link " View Product" [ref=e461] [cursor=pointer]:
                - /url: /product_details/21
                - generic [ref=e462]: 
                - text: View Product
        - generic [ref=e464]:
          - generic [ref=e465]:
            - generic [ref=e466]:
              - img "ecommerce website products"
              - heading "Rs. 1600" [level=2] [ref=e467]
              - paragraph [ref=e468]: Long Maxi Tulle Fancy Dress Up Outfits -Pink
              - generic [ref=e469] [cursor=pointer]:
                - generic [ref=e470]: 
                - text: Add to cart
            - generic [ref=e471]:
              - heading "Rs. 1600" [level=2] [ref=e472]
              - paragraph [ref=e473]: Long Maxi Tulle Fancy Dress Up Outfits -Pink
              - generic [ref=e474] [cursor=pointer]:
                - generic [ref=e475]: 
                - text: Add to cart
          - list [ref=e477]:
            - listitem [ref=e478]:
              - link " View Product" [ref=e479] [cursor=pointer]:
                - /url: /product_details/22
                - generic [ref=e480]: 
                - text: View Product
        - generic [ref=e482]:
          - generic [ref=e483]:
            - generic [ref=e484]:
              - img "ecommerce website products" [ref=e485]
              - heading "Rs. 1100" [level=2] [ref=e486]
              - paragraph [ref=e487]: Sleeveless Unicorn Print Fit & Flare Net Dress - Multi
              - generic [ref=e488] [cursor=pointer]:
                - generic [ref=e489]: 
                - text: Add to cart
            - generic [ref=e490]:
              - heading "Rs. 1100" [level=2] [ref=e491]
              - paragraph [ref=e492]: Sleeveless Unicorn Print Fit & Flare Net Dress - Multi
              - generic [ref=e493] [cursor=pointer]:
                - generic [ref=e494]: 
                - text: Add to cart
          - list [ref=e496]:
            - listitem [ref=e497]:
              - link " View Product" [ref=e498] [cursor=pointer]:
                - /url: /product_details/23
                - generic [ref=e499]: 
                - text: View Product
        - generic [ref=e501]:
          - generic [ref=e502]:
            - generic [ref=e503]:
              - img "ecommerce website products"
              - heading "Rs. 849" [level=2] [ref=e504]
              - paragraph [ref=e505]: Colour Blocked Shirt – Sky Blue
              - generic [ref=e506] [cursor=pointer]:
                - generic [ref=e507]: 
                - text: Add to cart
            - generic [ref=e508]:
              - heading "Rs. 849" [level=2] [ref=e509]
              - paragraph [ref=e510]: Colour Blocked Shirt – Sky Blue
              - generic [ref=e511] [cursor=pointer]:
                - generic [ref=e512]: 
                - text: Add to cart
          - list [ref=e514]:
            - listitem [ref=e515]:
              - link " View Product" [ref=e516] [cursor=pointer]:
                - /url: /product_details/24
                - generic [ref=e517]: 
                - text: View Product
        - generic [ref=e519]:
          - generic [ref=e520]:
            - generic [ref=e521]:
              - img "ecommerce website products" [ref=e522]
              - heading "Rs. 1299" [level=2] [ref=e523]
              - paragraph [ref=e524]: Pure Cotton V-Neck T-Shirt
              - generic [ref=e525] [cursor=pointer]:
                - generic [ref=e526]: 
                - text: Add to cart
            - generic [ref=e527]:
              - heading "Rs. 1299" [level=2] [ref=e528]
              - paragraph [ref=e529]: Pure Cotton V-Neck T-Shirt
              - generic [ref=e530] [cursor=pointer]:
                - generic [ref=e531]: 
                - text: Add to cart
          - list [ref=e533]:
            - listitem [ref=e534]:
              - link " View Product" [ref=e535] [cursor=pointer]:
                - /url: /product_details/28
                - generic [ref=e536]: 
                - text: View Product
        - generic [ref=e538]:
          - generic [ref=e539]:
            - generic [ref=e540]:
              - img "ecommerce website products" [ref=e541]
              - heading "Rs. 1000" [level=2] [ref=e542]
              - paragraph [ref=e543]: Green Side Placket Detail T-Shirt
              - generic [ref=e544] [cursor=pointer]:
                - generic [ref=e545]: 
                - text: Add to cart
            - generic [ref=e546]:
              - heading "Rs. 1000" [level=2] [ref=e547]
              - paragraph [ref=e548]: Green Side Placket Detail T-Shirt
              - generic [ref=e549] [cursor=pointer]:
                - generic [ref=e550]: 
                - text: Add to cart
          - list [ref=e552]:
            - listitem [ref=e553]:
              - link " View Product" [ref=e554] [cursor=pointer]:
                - /url: /product_details/29
                - generic [ref=e555]: 
                - text: View Product
        - generic [ref=e557]:
          - generic [ref=e558]:
            - generic [ref=e559]:
              - img "ecommerce website products" [ref=e560]
              - heading "Rs. 1500" [level=2] [ref=e561]
              - paragraph [ref=e562]: Premium Polo T-Shirts
              - generic [ref=e563] [cursor=pointer]:
                - generic [ref=e564]: 
                - text: Add to cart
            - generic [ref=e565]:
              - heading "Rs. 1500" [level=2] [ref=e566]
              - paragraph [ref=e567]: Premium Polo T-Shirts
              - generic [ref=e568] [cursor=pointer]:
                - generic [ref=e569]: 
                - text: Add to cart
          - list [ref=e571]:
            - listitem [ref=e572]:
              - link " View Product" [ref=e573] [cursor=pointer]:
                - /url: /product_details/30
                - generic [ref=e574]: 
                - text: View Product
        - generic [ref=e576]:
          - generic [ref=e577]:
            - generic [ref=e578]:
              - img "ecommerce website products" [ref=e579]
              - heading "Rs. 850" [level=2] [ref=e580]
              - paragraph [ref=e581]: Pure Cotton Neon Green Tshirt
              - generic [ref=e582] [cursor=pointer]:
                - generic [ref=e583]: 
                - text: Add to cart
            - generic [ref=e584]:
              - heading "Rs. 850" [level=2] [ref=e585]
              - paragraph [ref=e586]: Pure Cotton Neon Green Tshirt
              - generic [ref=e587] [cursor=pointer]:
                - generic [ref=e588]: 
                - text: Add to cart
          - list [ref=e590]:
            - listitem [ref=e591]:
              - link " View Product" [ref=e592] [cursor=pointer]:
                - /url: /product_details/31
                - generic [ref=e593]: 
                - text: View Product
        - generic [ref=e595]:
          - generic [ref=e596]:
            - generic [ref=e597]:
              - img "ecommerce website products" [ref=e598]
              - heading "Rs. 799" [level=2] [ref=e599]
              - paragraph [ref=e600]: Soft Stretch Jeans
              - generic [ref=e601] [cursor=pointer]:
                - generic [ref=e602]: 
                - text: Add to cart
            - generic [ref=e603]:
              - heading "Rs. 799" [level=2] [ref=e604]
              - paragraph [ref=e605]: Soft Stretch Jeans
              - generic [ref=e606] [cursor=pointer]:
                - generic [ref=e607]: 
                - text: Add to cart
          - list [ref=e609]:
            - listitem [ref=e610]:
              - link " View Product" [ref=e611] [cursor=pointer]:
                - /url: /product_details/33
                - generic [ref=e612]: 
                - text: View Product
        - generic [ref=e614]:
          - generic [ref=e615]:
            - generic [ref=e616]:
              - img "ecommerce website products" [ref=e617]
              - heading "Rs. 1200" [level=2] [ref=e618]
              - paragraph [ref=e619]: Regular Fit Straight Jeans
              - generic [ref=e620] [cursor=pointer]:
                - generic [ref=e621]: 
                - text: Add to cart
            - generic [ref=e622]:
              - heading "Rs. 1200" [level=2] [ref=e623]
              - paragraph [ref=e624]: Regular Fit Straight Jeans
              - generic [ref=e625] [cursor=pointer]:
                - generic [ref=e626]: 
                - text: Add to cart
          - list [ref=e628]:
            - listitem [ref=e629]:
              - link " View Product" [ref=e630] [cursor=pointer]:
                - /url: /product_details/35
                - generic [ref=e631]: 
                - text: View Product
        - generic [ref=e633]:
          - generic [ref=e634]:
            - generic [ref=e635]:
              - img "ecommerce website products" [ref=e636]
              - heading "Rs. 1400" [level=2] [ref=e637]
              - paragraph [ref=e638]: Grunt Blue Slim Fit Jeans
              - generic [ref=e639] [cursor=pointer]:
                - generic [ref=e640]: 
                - text: Add to cart
            - generic [ref=e641]:
              - heading "Rs. 1400" [level=2] [ref=e642]
              - paragraph [ref=e643]: Grunt Blue Slim Fit Jeans
              - generic [ref=e644] [cursor=pointer]:
                - generic [ref=e645]: 
                - text: Add to cart
          - list [ref=e647]:
            - listitem [ref=e648]:
              - link " View Product" [ref=e649] [cursor=pointer]:
                - /url: /product_details/37
                - generic [ref=e650]: 
                - text: View Product
        - generic [ref=e652]:
          - generic [ref=e653]:
            - generic [ref=e654]:
              - img "ecommerce website products" [ref=e655]
              - heading "Rs. 2300" [level=2] [ref=e656]
              - paragraph [ref=e657]: Rose Pink Embroidered Maxi Dress
              - generic [ref=e658] [cursor=pointer]:
                - generic [ref=e659]: 
                - text: Add to cart
            - generic [ref=e660]:
              - heading "Rs. 2300" [level=2] [ref=e661]
              - paragraph [ref=e662]: Rose Pink Embroidered Maxi Dress
              - generic [ref=e663] [cursor=pointer]:
                - generic [ref=e664]: 
                - text: Add to cart
          - list [ref=e666]:
            - listitem [ref=e667]:
              - link " View Product" [ref=e668] [cursor=pointer]:
                - /url: /product_details/38
                - generic [ref=e669]: 
                - text: View Product
        - generic [ref=e671]:
          - generic [ref=e672]:
            - generic [ref=e673]:
              - img "ecommerce website products" [ref=e674]
              - heading "Rs. 3000" [level=2] [ref=e675]
              - paragraph [ref=e676]: Cotton Silk Hand Block Print Saree
              - generic [ref=e677] [cursor=pointer]:
                - generic [ref=e678]: 
                - text: Add to cart
            - generic [ref=e679]:
              - heading "Rs. 3000" [level=2] [ref=e680]
              - paragraph [ref=e681]: Cotton Silk Hand Block Print Saree
              - generic [ref=e682] [cursor=pointer]:
                - generic [ref=e683]: 
                - text: Add to cart
          - list [ref=e685]:
            - listitem [ref=e686]:
              - link " View Product" [ref=e687] [cursor=pointer]:
                - /url: /product_details/39
                - generic [ref=e688]: 
                - text: View Product
        - generic [ref=e690]:
          - generic [ref=e691]:
            - generic [ref=e692]:
              - img "ecommerce website products"
              - heading "Rs. 3500" [level=2] [ref=e693]
              - paragraph [ref=e694]: Rust Red Linen Saree
              - generic [ref=e695] [cursor=pointer]:
                - generic [ref=e696]: 
                - text: Add to cart
            - generic [ref=e697]:
              - heading "Rs. 3500" [level=2] [ref=e698]
              - paragraph [ref=e699]: Rust Red Linen Saree
              - generic [ref=e700] [cursor=pointer]:
                - generic [ref=e701]: 
                - text: Add to cart
          - list [ref=e703]:
            - listitem [ref=e704]:
              - link " View Product" [ref=e705] [cursor=pointer]:
                - /url: /product_details/40
                - generic [ref=e706]: 
                - text: View Product
        - generic [ref=e708]:
          - generic [ref=e709]:
            - generic [ref=e710]:
              - img "ecommerce website products" [ref=e711]
              - heading "Rs. 5000" [level=2] [ref=e712]
              - paragraph [ref=e713]: Beautiful Peacock Blue Cotton Linen Saree
              - generic [ref=e714] [cursor=pointer]:
                - generic [ref=e715]: 
                - text: Add to cart
            - generic [ref=e716]:
              - heading "Rs. 5000" [level=2] [ref=e717]
              - paragraph [ref=e718]: Beautiful Peacock Blue Cotton Linen Saree
              - generic [ref=e719] [cursor=pointer]:
                - generic [ref=e720]: 
                - text: Add to cart
          - list [ref=e722]:
            - listitem [ref=e723]:
              - link " View Product" [ref=e724] [cursor=pointer]:
                - /url: /product_details/41
                - generic [ref=e725]: 
                - text: View Product
        - generic [ref=e727]:
          - generic [ref=e728]:
            - generic [ref=e729]:
              - img "ecommerce website products"
              - heading "Rs. 1400" [level=2] [ref=e730]
              - paragraph [ref=e731]: Lace Top For Women
              - generic [ref=e732] [cursor=pointer]:
                - generic [ref=e733]: 
                - text: Add to cart
            - generic [ref=e734]:
              - heading "Rs. 1400" [level=2] [ref=e735]
              - paragraph [ref=e736]: Lace Top For Women
              - generic [ref=e737] [cursor=pointer]:
                - generic [ref=e738]: 
                - text: Add to cart
          - list [ref=e740]:
            - listitem [ref=e741]:
              - link " View Product" [ref=e742] [cursor=pointer]:
                - /url: /product_details/42
                - generic [ref=e743]: 
                - text: View Product
        - generic [ref=e745]:
          - generic [ref=e746]:
            - generic [ref=e747]:
              - img "ecommerce website products"
              - heading "Rs. 1389" [level=2] [ref=e748]
              - paragraph [ref=e749]: GRAPHIC DESIGN MEN T SHIRT - BLUE
              - generic [ref=e750] [cursor=pointer]:
                - generic [ref=e751]: 
                - text: Add to cart
            - generic [ref=e752]:
              - heading "Rs. 1389" [level=2] [ref=e753]
              - paragraph [ref=e754]: GRAPHIC DESIGN MEN T SHIRT - BLUE
              - generic [ref=e755] [cursor=pointer]:
                - generic [ref=e756]: 
                - text: Add to cart
          - list [ref=e758]:
            - listitem [ref=e759]:
              - link " View Product" [ref=e760] [cursor=pointer]:
                - /url: /product_details/43
                - generic [ref=e761]: 
                - text: View Product
      - generic [ref=e762]:
        - heading "recommended items" [level=2] [ref=e763]
        - generic [ref=e764]:
          - generic [ref=e765]:
            - text:   
            - generic:
              - generic [ref=e769]:
                - img "ecommerce website products" [ref=e770]
                - heading "Rs. 1500" [level=2] [ref=e771]
                - paragraph [ref=e772]: Stylish Dress
                - generic [ref=e773] [cursor=pointer]:
                  - generic [ref=e774]: 
                  - text: Add to cart
              - generic [ref=e778]:
                - img "ecommerce website products" [ref=e779]
                - heading "Rs. 600" [level=2] [ref=e780]
                - paragraph [ref=e781]: Winter Top
                - generic [ref=e782] [cursor=pointer]:
                  - generic [ref=e783]: 
                  - text: Add to cart
              - generic [ref=e787]:
                - img "ecommerce website products" [ref=e788]
                - heading "Rs. 400" [level=2] [ref=e789]
                - paragraph [ref=e790]: Summer White Top
                - generic [ref=e791] [cursor=pointer]:
                  - generic [ref=e792]: 
                  - text: Add to cart
          - link "" [ref=e793] [cursor=pointer]:
            - /url: "#recommended-item-carousel"
          - link "" [ref=e795] [cursor=pointer]:
            - /url: "#recommended-item-carousel"
  - contentinfo [ref=e797]:
    - generic [ref=e802]:
      - heading "Subscription" [level=2] [ref=e803]
      - generic [ref=e804]:
        - textbox "Your email address" [ref=e805]
        - button "" [ref=e806] [cursor=pointer]
        - paragraph [ref=e808]: Get the most recent updates from our site and be updated your self...
    - paragraph [ref=e812]: Copyright © 2021 All rights reserved
  - link "" [ref=e813] [cursor=pointer]:
    - /url: "#top"
```

# Test source

```ts
  21  |   test("VR-02: Category sidebar", async ({ page, homePage }) => {
  22  |     await expect(homePage.categoryHeading).toBeVisible();
  23  |     await expect(homePage.categorySidebar).toBeVisible();
  24  | 
  25  |     // A clip, not an element screenshot: the heading is `#accordian`'s own
  26  |     // sibling, not its parent, so no single locator's own box covers both.
  27  |     const clip = await homePage.unionBoundingBox([
  28  |       homePage.categoryHeading,
  29  |       homePage.categorySidebar,
  30  |     ]);
  31  |     await expect(page).toHaveScreenshot("home-category-sidebar.png", {
  32  |       clip,
  33  |     });
  34  |   });
  35  | 
  36  |   test("VR-03: Category sidebar, expanded", async ({ page, homePage }) => {
  37  |     await expect(homePage.categoryHeading).toBeVisible();
  38  |     await homePage.getCategoryLink("Women").click();
  39  |     await expect(homePage.getSubCategoryLink("Women", "Saree")).toBeVisible();
  40  |     // "Saree" being visible is not enough: the panel's growing height keeps
  41  |     // pushing "Men" and "Kids" down for a moment afterward, so a clip taken
  42  |     // right here can still miss "Kids" entirely. Confirmed in CI, where the
  43  |     // sidebar's own height landed between the collapsed and fully-open
  44  |     // values. Wait for the sidebar's own box to stop changing first.
  45  |     await homePage.waitForStableBoundingBox(homePage.categorySidebar);
  46  | 
  47  |     // A clip, not an element screenshot, and recomputed after expanding: the
  48  |     // panel's own height grows once "Women" opens, and the heading is still
  49  |     // `#accordian`'s sibling rather than its parent.
  50  |     const clip = await homePage.unionBoundingBox([
  51  |       homePage.categoryHeading,
  52  |       homePage.categorySidebar,
  53  |     ]);
  54  |     await expect(page).toHaveScreenshot("home-category-sidebar-expanded.png", {
  55  |       clip,
  56  |     });
  57  |   });
  58  | 
  59  |   test("VR-04: Brands sidebar", async ({ homePage }) => {
  60  |     await expect(homePage.brandsSidebar).toBeVisible();
  61  | 
  62  |     await expect(homePage.brandsSidebar).toHaveScreenshot(
  63  |       "home-brands-sidebar.png",
  64  |     );
  65  |   });
  66  | 
  67  |   test("VR-05: Featured product card", async ({ homePage }) => {
  68  |     const card = homePage.getProductCard(products.blueTop.name);
  69  |     await expect(card).toBeVisible();
  70  |     await homePage.waitForImagesLoaded(card);
  71  | 
  72  |     await expect(card).toHaveScreenshot("home-product-card.png", {
  73  |       maxDiffPixelRatio: 0.05, // VR: product photography compresses inconsistently
  74  |     });
  75  |   });
  76  | 
  77  |   test("VR-06: Recommended items section", async ({ homePage }) => {
  78  |     await expect(homePage.recommendedItemsHeading).toBeVisible();
  79  |     await homePage.scrollToTop(homePage.recommendedItemsHeading);
  80  |     await homePage.waitForImagesLoaded(homePage.recommendedItemsSection);
  81  | 
  82  |     await expect(homePage.recommendedItemsSection).toHaveScreenshot(
  83  |       "home-recommended-items.png",
  84  |       { maxDiffPixelRatio: 0.05 }, // VR: product photography compresses inconsistently
  85  |     );
  86  |   });
  87  | 
  88  |   test("VR-07: Subscription widget", async ({ homePage }) => {
  89  |     await homePage.subscriptionSection.scrollIntoViewIfNeeded();
  90  |     await expect(homePage.subscriptionHeading).toBeVisible();
  91  | 
  92  |     await expect(homePage.subscriptionSection).toHaveScreenshot(
  93  |       "home-subscription.png",
  94  |       { maxDiffPixelRatio: 0.03 }, // VR: the widget is small, so its text's own antialiasing alone clears the default
  95  |     );
  96  |   });
  97  | 
  98  |   test("VR-08: Subscription widget, subscribed", async ({ page, homePage }) => {
  99  |     // A fixed, literal email rather than `buildAccount()`: the field is not
  100 |     // cleared after success, so a per-run generated address would leave its
  101 |     // own text different on every capture.
  102 |     await homePage.subscribeToNewsletter("vr.subscriber@example.com");
  103 |     await expect(homePage.subscriptionSuccessMessage).toBeVisible();
  104 | 
  105 |     // A clip, not an element screenshot: the success banner (`#success-subscribe`)
  106 |     // is the widget's sibling, not its parent, so no single locator's own box
  107 |     // covers both. Verified live.
  108 |     const clip = await homePage.unionBoundingBox([
  109 |       homePage.subscriptionSuccessMessage,
  110 |       homePage.subscriptionSection,
  111 |     ]);
  112 |     await expect(page).toHaveScreenshot("home-subscription-success.png", {
  113 |       clip,
  114 |     });
  115 |   });
  116 | 
  117 |   test("VR-09: Footer bar", async ({ homePage }) => {
  118 |     await homePage.footerBottom.scrollIntoViewIfNeeded();
  119 |     await expect(homePage.copyrightText).toBeVisible();
  120 | 
> 121 |     await expect(homePage.footerBottom).toHaveScreenshot("home-footer.png");
      |                                         ^ Error: expect(locator).toHaveScreenshot(expected) failed
  122 |   });
  123 | 
  124 |   test("VR-10: Add-to-cart confirmation modal", async ({ page, homePage }) => {
  125 |     const modal = await homePage.addProductToCartFromListing(
  126 |       products.blueTop.id,
  127 |     );
  128 |     await expect(modal.heading).toBeVisible();
  129 | 
  130 |     await expect(page).toHaveScreenshot("home-add-to-cart-modal.png", {
  131 |       maxDiffPixelRatio: 0.03, // VR: full-page capture over the page's own product imagery
  132 |     });
  133 |   });
  134 | });
  135 | 
```