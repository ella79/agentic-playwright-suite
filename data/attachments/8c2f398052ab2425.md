# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests/products/products.spec.ts >> Products Page >> TC-15: A search with no matches returns an empty result set
- Location: tests/products/products.spec.ts:72:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.goto: Test timeout of 30000ms exceeded.
Call log:
  - navigating to "https://automationexercise.com/products", waiting until "load"

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - banner [ref=e2]:
    - generic [ref=e5]:
      - generic [ref=e6]:
        - generic:
          - link "Website for automation practice":
            - /url: /
            - img "Website for automation practice"
      - list [ref=e9]:
        - listitem [ref=e10]:
          - link "Home" [ref=e11]:
            - /url: /
        - listitem [ref=e12]:
          - link " Products" [ref=e13]:
            - /url: /products
            - generic [ref=e14]: 
            - text: Products
        - listitem [ref=e15]:
          - link "Cart" [ref=e16]:
            - /url: /view_cart
        - listitem [ref=e17]:
          - link "Logout" [ref=e18]:
            - /url: /logout
        - listitem [ref=e19]:
          - link "Delete Account" [ref=e20]:
            - /url: /delete_account
        - listitem [ref=e21]:
          - link "Test Cases" [ref=e22]:
            - /url: /test_cases
        - listitem [ref=e23]:
          - link "API Testing" [ref=e24]:
            - /url: /api_list
        - listitem [ref=e25]:
          - link "Video Tutorials" [ref=e26]:
            - /url: https://www.youtube.com/c/AutomationExercise
        - listitem [ref=e27]:
          - link "Contact us" [ref=e28]:
            - /url: /contact_us
        - listitem [ref=e29]:
          - generic [ref=e30]: Logged in as Jon Doe
  - generic [ref=e32]:
    - img "Website for practice" [ref=e33]
    - textbox "Search Product" [ref=e34]
    - button [ref=e35] [cursor=pointer]
  - generic [ref=e38]:
    - generic [ref=e40]:
      - heading "Category" [level=2] [ref=e41]
      - generic [ref=e42]:
        - heading [level=4] [ref=e45]:
          - link "Women" [ref=e46]:
            - /url: "#Women"
        - heading [level=4] [ref=e50]:
          - link "Men" [ref=e51]:
            - /url: "#Men"
        - heading [level=4] [ref=e55]:
          - link "Kids" [ref=e56]:
            - /url: "#Kids"
      - generic [ref=e58]:
        - heading "Brands" [level=2] [ref=e59]
        - list [ref=e61]:
          - listitem [ref=e62]:
            - link "(6) Polo" [ref=e63]:
              - /url: /brand_products/Polo
              - generic [ref=e64]: (6)
              - text: Polo
          - listitem [ref=e65]:
            - link "(5) H&M" [ref=e66]:
              - /url: /brand_products/H&M
              - generic [ref=e67]: (5)
              - text: H&M
          - listitem [ref=e68]:
            - link "(5) Madame" [ref=e69]:
              - /url: /brand_products/Madame
              - generic [ref=e70]: (5)
              - text: Madame
          - listitem [ref=e71]:
            - link "(3) Mast & Harbour" [ref=e72]:
              - /url: /brand_products/Mast & Harbour
              - generic [ref=e73]: (3)
              - text: Mast & Harbour
          - listitem [ref=e74]:
            - link "(4) Babyhug" [ref=e75]:
              - /url: /brand_products/Babyhug
              - generic [ref=e76]: (4)
              - text: Babyhug
          - listitem [ref=e77]:
            - link "(3) Allen Solly Junior" [ref=e78]:
              - /url: /brand_products/Allen Solly Junior
              - generic [ref=e79]: (3)
              - text: Allen Solly Junior
          - listitem [ref=e80]:
            - link "(3) Kookie Kids" [ref=e81]:
              - /url: /brand_products/Kookie Kids
              - generic [ref=e82]: (3)
              - text: Kookie Kids
          - listitem [ref=e83]:
            - link "(5) Biba" [ref=e84]:
              - /url: /brand_products/Biba
              - generic [ref=e85]: (5)
              - text: Biba
    - generic [ref=e87]:
      - heading "All Products" [level=2] [ref=e88]
      - generic [ref=e90]:
        - generic [ref=e91]:
          - generic [ref=e92]:
            - img "ecommerce website products"
            - heading "Rs. 500" [level=2] [ref=e93]
            - paragraph [ref=e94]: Blue Top
            - generic [ref=e95] [cursor=pointer]: Add to cart
          - generic [ref=e97]:
            - heading "Rs. 500" [level=2] [ref=e98]
            - paragraph [ref=e99]: Blue Top
            - generic [ref=e100] [cursor=pointer]: Add to cart
        - list [ref=e102]:
          - listitem [ref=e103]:
            - link "View Product" [ref=e104]:
              - /url: /product_details/1
      - generic [ref=e106]:
        - generic [ref=e107]:
          - generic [ref=e108]:
            - img "ecommerce website products"
            - heading "Rs. 400" [level=2] [ref=e109]
            - paragraph [ref=e110]: Men Tshirt
            - generic [ref=e111] [cursor=pointer]: Add to cart
          - generic [ref=e113]:
            - heading "Rs. 400" [level=2] [ref=e114]
            - paragraph [ref=e115]: Men Tshirt
            - generic [ref=e116] [cursor=pointer]: Add to cart
        - list [ref=e118]:
          - listitem [ref=e119]:
            - link "View Product" [ref=e120]:
              - /url: /product_details/2
      - generic [ref=e122]:
        - generic [ref=e123]:
          - generic [ref=e124]:
            - img "ecommerce website products"
            - heading "Rs. 1000" [level=2] [ref=e125]
            - paragraph [ref=e126]: Sleeveless Dress
            - generic [ref=e127] [cursor=pointer]: Add to cart
          - generic [ref=e129]:
            - heading "Rs. 1000" [level=2] [ref=e130]
            - paragraph [ref=e131]: Sleeveless Dress
            - generic [ref=e132] [cursor=pointer]: Add to cart
        - list [ref=e134]:
          - listitem [ref=e135]:
            - link "View Product" [ref=e136]:
              - /url: /product_details/3
      - generic [ref=e138]:
        - generic [ref=e139]:
          - generic [ref=e140]:
            - img "ecommerce website products"
            - heading "Rs. 1500" [level=2] [ref=e141]
            - paragraph [ref=e142]: Stylish Dress
            - generic [ref=e143] [cursor=pointer]: Add to cart
          - generic [ref=e145]:
            - heading "Rs. 1500" [level=2] [ref=e146]
            - paragraph [ref=e147]: Stylish Dress
            - generic [ref=e148] [cursor=pointer]: Add to cart
        - list [ref=e150]:
          - listitem [ref=e151]:
            - link "View Product" [ref=e152]:
              - /url: /product_details/4
      - generic [ref=e154]:
        - generic [ref=e155]:
          - generic [ref=e156]:
            - img "ecommerce website products"
            - heading "Rs. 600" [level=2] [ref=e157]
            - paragraph [ref=e158]: Winter Top
            - generic [ref=e159] [cursor=pointer]: Add to cart
          - generic [ref=e161]:
            - heading "Rs. 600" [level=2] [ref=e162]
            - paragraph [ref=e163]: Winter Top
            - generic [ref=e164] [cursor=pointer]: Add to cart
        - list [ref=e166]:
          - listitem [ref=e167]:
            - link "View Product" [ref=e168]:
              - /url: /product_details/5
      - generic [ref=e170]:
        - generic [ref=e171]:
          - generic [ref=e172]:
            - img "ecommerce website products"
            - heading "Rs. 400" [level=2] [ref=e173]
            - paragraph [ref=e174]: Summer White Top
            - generic [ref=e175] [cursor=pointer]: Add to cart
          - generic [ref=e177]:
            - heading "Rs. 400" [level=2] [ref=e178]
            - paragraph [ref=e179]: Summer White Top
            - generic [ref=e180] [cursor=pointer]: Add to cart
        - list [ref=e182]:
          - listitem [ref=e183]:
            - link "View Product" [ref=e184]:
              - /url: /product_details/6
      - generic [ref=e186]:
        - generic [ref=e187]:
          - generic [ref=e188]:
            - img "ecommerce website products"
            - heading "Rs. 1000" [level=2] [ref=e189]
            - paragraph [ref=e190]: Madame Top For Women
            - generic [ref=e191] [cursor=pointer]: Add to cart
          - generic [ref=e193]:
            - heading "Rs. 1000" [level=2] [ref=e194]
            - paragraph [ref=e195]: Madame Top For Women
            - generic [ref=e196] [cursor=pointer]: Add to cart
        - list [ref=e198]:
          - listitem [ref=e199]:
            - link "View Product" [ref=e200]:
              - /url: /product_details/7
      - generic [ref=e202]:
        - generic [ref=e203]:
          - generic [ref=e204]:
            - img "ecommerce website products"
            - heading "Rs. 700" [level=2] [ref=e205]
            - paragraph [ref=e206]: Fancy Green Top
            - generic [ref=e207] [cursor=pointer]: Add to cart
          - generic [ref=e209]:
            - heading "Rs. 700" [level=2] [ref=e210]
            - paragraph [ref=e211]: Fancy Green Top
            - generic [ref=e212] [cursor=pointer]: Add to cart
        - list [ref=e214]:
          - listitem [ref=e215]:
            - link "View Product" [ref=e216]:
              - /url: /product_details/8
      - generic [ref=e218]:
        - generic [ref=e219]:
          - generic [ref=e220]:
            - img "ecommerce website products"
            - heading "Rs. 499" [level=2] [ref=e221]
            - paragraph [ref=e222]: Sleeves Printed Top - White
            - generic [ref=e223] [cursor=pointer]: Add to cart
          - generic [ref=e225]:
            - heading "Rs. 499" [level=2] [ref=e226]
            - paragraph [ref=e227]: Sleeves Printed Top - White
            - generic [ref=e228] [cursor=pointer]: Add to cart
        - list [ref=e230]:
          - listitem [ref=e231]:
            - link "View Product" [ref=e232]:
              - /url: /product_details/11
      - generic [ref=e234]:
        - generic [ref=e235]:
          - generic [ref=e236]:
            - img "ecommerce website products"
            - heading "Rs. 359" [level=2] [ref=e237]
            - paragraph [ref=e238]: Half Sleeves Top Schiffli Detailing - Pink
            - generic [ref=e239] [cursor=pointer]: Add to cart
          - generic [ref=e241]:
            - heading "Rs. 359" [level=2] [ref=e242]
            - paragraph [ref=e243]: Half Sleeves Top Schiffli Detailing - Pink
            - generic [ref=e244] [cursor=pointer]: Add to cart
        - list [ref=e246]:
          - listitem [ref=e247]:
            - link "View Product" [ref=e248]:
              - /url: /product_details/12
      - generic [ref=e250]:
        - generic [ref=e251]:
          - generic [ref=e252]:
            - img "ecommerce website products"
            - heading "Rs. 278" [level=2] [ref=e253]
            - paragraph [ref=e254]: Frozen Tops For Kids
            - generic [ref=e255] [cursor=pointer]: Add to cart
          - generic [ref=e257]:
            - heading "Rs. 278" [level=2] [ref=e258]
            - paragraph [ref=e259]: Frozen Tops For Kids
            - generic [ref=e260] [cursor=pointer]: Add to cart
        - list [ref=e262]:
          - listitem [ref=e263]:
            - link "View Product" [ref=e264]:
              - /url: /product_details/13
      - generic [ref=e266]:
        - generic [ref=e267]:
          - generic [ref=e268]:
            - img "ecommerce website products"
            - heading "Rs. 679" [level=2] [ref=e269]
            - paragraph [ref=e270]: Full Sleeves Top Cherry - Pink
            - generic [ref=e271] [cursor=pointer]: Add to cart
          - generic [ref=e273]:
            - heading "Rs. 679" [level=2] [ref=e274]
            - paragraph [ref=e275]: Full Sleeves Top Cherry - Pink
            - generic [ref=e276] [cursor=pointer]: Add to cart
        - list [ref=e278]:
          - listitem [ref=e279]:
            - link "View Product" [ref=e280]:
              - /url: /product_details/14
      - generic [ref=e282]:
        - generic [ref=e283]:
          - generic [ref=e284]:
            - img "ecommerce website products"
            - heading "Rs. 315" [level=2] [ref=e285]
            - paragraph [ref=e286]: Printed Off Shoulder Top - White
            - generic [ref=e287] [cursor=pointer]: Add to cart
          - generic [ref=e289]:
            - heading "Rs. 315" [level=2] [ref=e290]
            - paragraph [ref=e291]: Printed Off Shoulder Top - White
            - generic [ref=e292] [cursor=pointer]: Add to cart
        - list [ref=e294]:
          - listitem [ref=e295]:
            - link "View Product" [ref=e296]:
              - /url: /product_details/15
      - generic [ref=e298]:
        - generic [ref=e299]:
          - generic [ref=e300]:
            - img "ecommerce website products"
            - heading "Rs. 478" [level=2] [ref=e301]
            - paragraph [ref=e302]: Sleeves Top and Short - Blue & Pink
            - generic [ref=e303] [cursor=pointer]: Add to cart
          - generic [ref=e305]:
            - heading "Rs. 478" [level=2] [ref=e306]
            - paragraph [ref=e307]: Sleeves Top and Short - Blue & Pink
            - generic [ref=e308] [cursor=pointer]: Add to cart
        - list [ref=e310]:
          - listitem [ref=e311]:
            - link "View Product" [ref=e312]:
              - /url: /product_details/16
      - generic [ref=e314]:
        - generic [ref=e315]:
          - generic [ref=e316]:
            - img "ecommerce website products"
            - heading "Rs. 1200" [level=2] [ref=e317]
            - paragraph [ref=e318]: Little Girls Mr. Panda Shirt
            - generic [ref=e319] [cursor=pointer]: Add to cart
          - generic [ref=e321]:
            - heading "Rs. 1200" [level=2] [ref=e322]
            - paragraph [ref=e323]: Little Girls Mr. Panda Shirt
            - generic [ref=e324] [cursor=pointer]: Add to cart
        - list [ref=e326]:
          - listitem [ref=e327]:
            - link "View Product" [ref=e328]:
              - /url: /product_details/18
      - generic [ref=e330]:
        - generic [ref=e331]:
          - generic [ref=e332]:
            - img "ecommerce website products"
            - heading "Rs. 1050" [level=2] [ref=e333]
            - paragraph [ref=e334]: Sleeveless Unicorn Patch Gown - Pink
            - generic [ref=e335] [cursor=pointer]: Add to cart
          - generic [ref=e337]:
            - heading "Rs. 1050" [level=2] [ref=e338]
            - paragraph [ref=e339]: Sleeveless Unicorn Patch Gown - Pink
            - generic [ref=e340] [cursor=pointer]: Add to cart
        - list [ref=e342]:
          - listitem [ref=e343]:
            - link "View Product" [ref=e344]:
              - /url: /product_details/19
      - generic [ref=e346]:
        - generic [ref=e347]:
          - generic [ref=e348]:
            - img "ecommerce website products"
            - heading "Rs. 1190" [level=2] [ref=e349]
            - paragraph [ref=e350]: Cotton Mull Embroidered Dress
            - generic [ref=e351] [cursor=pointer]: Add to cart
          - generic [ref=e353]:
            - heading "Rs. 1190" [level=2] [ref=e354]
            - paragraph [ref=e355]: Cotton Mull Embroidered Dress
            - generic [ref=e356] [cursor=pointer]: Add to cart
        - list [ref=e358]:
          - listitem [ref=e359]:
            - link "View Product" [ref=e360]:
              - /url: /product_details/20
      - generic [ref=e362]:
        - generic [ref=e363]:
          - generic [ref=e364]:
            - img "ecommerce website products"
            - heading "Rs. 1530" [level=2] [ref=e365]
            - paragraph [ref=e366]: Blue Cotton Indie Mickey Dress
            - generic [ref=e367] [cursor=pointer]: Add to cart
          - generic [ref=e369]:
            - heading "Rs. 1530" [level=2] [ref=e370]
            - paragraph [ref=e371]: Blue Cotton Indie Mickey Dress
            - generic [ref=e372] [cursor=pointer]: Add to cart
        - list [ref=e374]:
          - listitem [ref=e375]:
            - link "View Product" [ref=e376]:
              - /url: /product_details/21
      - generic [ref=e378]:
        - generic [ref=e379]:
          - generic [ref=e380]:
            - img "ecommerce website products"
            - heading "Rs. 1600" [level=2] [ref=e381]
            - paragraph [ref=e382]: Long Maxi Tulle Fancy Dress Up Outfits -Pink
            - generic [ref=e383] [cursor=pointer]: Add to cart
          - generic [ref=e385]:
            - heading "Rs. 1600" [level=2] [ref=e386]
            - paragraph [ref=e387]: Long Maxi Tulle Fancy Dress Up Outfits -Pink
            - generic [ref=e388] [cursor=pointer]: Add to cart
        - list [ref=e390]:
          - listitem [ref=e391]:
            - link "View Product" [ref=e392]:
              - /url: /product_details/22
      - generic [ref=e394]:
        - generic [ref=e395]:
          - generic [ref=e396]:
            - img "ecommerce website products"
            - heading "Rs. 1100" [level=2] [ref=e397]
            - paragraph [ref=e398]: Sleeveless Unicorn Print Fit & Flare Net Dress - Multi
            - generic [ref=e399] [cursor=pointer]: Add to cart
          - generic [ref=e401]:
            - heading "Rs. 1100" [level=2] [ref=e402]
            - paragraph [ref=e403]: Sleeveless Unicorn Print Fit & Flare Net Dress - Multi
            - generic [ref=e404] [cursor=pointer]: Add to cart
        - list [ref=e406]:
          - listitem [ref=e407]:
            - link "View Product" [ref=e408]:
              - /url: /product_details/23
      - generic [ref=e410]:
        - generic [ref=e411]:
          - generic [ref=e412]:
            - img "ecommerce website products"
            - heading "Rs. 849" [level=2] [ref=e413]
            - paragraph [ref=e414]: Colour Blocked Shirt – Sky Blue
            - generic [ref=e415] [cursor=pointer]: Add to cart
          - generic [ref=e417]:
            - heading "Rs. 849" [level=2] [ref=e418]
            - paragraph [ref=e419]: Colour Blocked Shirt – Sky Blue
            - generic [ref=e420] [cursor=pointer]: Add to cart
        - list [ref=e422]:
          - listitem [ref=e423]:
            - link "View Product" [ref=e424]:
              - /url: /product_details/24
      - generic [ref=e426]:
        - generic [ref=e427]:
          - generic [ref=e428]:
            - img "ecommerce website products"
            - heading "Rs. 1299" [level=2] [ref=e429]
            - paragraph [ref=e430]: Pure Cotton V-Neck T-Shirt
            - generic [ref=e431] [cursor=pointer]: Add to cart
          - generic [ref=e433]:
            - heading "Rs. 1299" [level=2] [ref=e434]
            - paragraph [ref=e435]: Pure Cotton V-Neck T-Shirt
            - generic [ref=e436] [cursor=pointer]: Add to cart
        - list [ref=e438]:
          - listitem [ref=e439]:
            - link "View Product" [ref=e440]:
              - /url: /product_details/28
      - generic [ref=e442]:
        - generic [ref=e443]:
          - generic [ref=e444]:
            - img "ecommerce website products"
            - heading "Rs. 1000" [level=2] [ref=e445]
            - paragraph [ref=e446]: Green Side Placket Detail T-Shirt
            - generic [ref=e447] [cursor=pointer]: Add to cart
          - generic [ref=e449]:
            - heading "Rs. 1000" [level=2] [ref=e450]
            - paragraph [ref=e451]: Green Side Placket Detail T-Shirt
            - generic [ref=e452] [cursor=pointer]: Add to cart
        - list [ref=e454]:
          - listitem [ref=e455]:
            - link "View Product" [ref=e456]:
              - /url: /product_details/29
      - generic [ref=e458]:
        - generic [ref=e459]:
          - generic [ref=e460]:
            - img "ecommerce website products"
            - heading "Rs. 1500" [level=2] [ref=e461]
            - paragraph [ref=e462]: Premium Polo T-Shirts
            - generic [ref=e463] [cursor=pointer]: Add to cart
          - generic [ref=e465]:
            - heading "Rs. 1500" [level=2] [ref=e466]
            - paragraph [ref=e467]: Premium Polo T-Shirts
            - generic [ref=e468] [cursor=pointer]: Add to cart
        - list [ref=e470]:
          - listitem [ref=e471]:
            - link "View Product" [ref=e472]:
              - /url: /product_details/30
      - generic [ref=e474]:
        - generic [ref=e475]:
          - generic [ref=e476]:
            - img "ecommerce website products"
            - heading "Rs. 850" [level=2] [ref=e477]
            - paragraph [ref=e478]: Pure Cotton Neon Green Tshirt
            - generic [ref=e479] [cursor=pointer]: Add to cart
          - generic [ref=e481]:
            - heading "Rs. 850" [level=2] [ref=e482]
            - paragraph [ref=e483]: Pure Cotton Neon Green Tshirt
            - generic [ref=e484] [cursor=pointer]: Add to cart
        - list [ref=e486]:
          - listitem [ref=e487]:
            - link "View Product" [ref=e488]:
              - /url: /product_details/31
      - generic [ref=e490]:
        - generic [ref=e491]:
          - generic [ref=e492]:
            - img "ecommerce website products"
            - heading "Rs. 799" [level=2] [ref=e493]
            - paragraph [ref=e494]: Soft Stretch Jeans
            - generic [ref=e495] [cursor=pointer]: Add to cart
          - generic [ref=e497]:
            - heading "Rs. 799" [level=2] [ref=e498]
            - paragraph [ref=e499]: Soft Stretch Jeans
            - generic [ref=e500] [cursor=pointer]: Add to cart
        - list [ref=e502]:
          - listitem [ref=e503]:
            - link "View Product" [ref=e504]:
              - /url: /product_details/33
      - generic [ref=e506]:
        - generic [ref=e507]:
          - generic [ref=e508]:
            - img "ecommerce website products"
            - heading "Rs. 1200" [level=2] [ref=e509]
            - paragraph [ref=e510]: Regular Fit Straight Jeans
            - generic [ref=e511] [cursor=pointer]: Add to cart
          - generic [ref=e513]:
            - heading "Rs. 1200" [level=2] [ref=e514]
            - paragraph [ref=e515]: Regular Fit Straight Jeans
            - generic [ref=e516] [cursor=pointer]: Add to cart
        - list [ref=e518]:
          - listitem [ref=e519]:
            - link "View Product" [ref=e520]:
              - /url: /product_details/35
      - generic [ref=e522]:
        - generic [ref=e523]:
          - generic [ref=e524]:
            - img "ecommerce website products"
            - heading "Rs. 1400" [level=2] [ref=e525]
            - paragraph [ref=e526]: Grunt Blue Slim Fit Jeans
            - generic [ref=e527] [cursor=pointer]: Add to cart
          - generic [ref=e529]:
            - heading "Rs. 1400" [level=2] [ref=e530]
            - paragraph [ref=e531]: Grunt Blue Slim Fit Jeans
            - generic [ref=e532] [cursor=pointer]: Add to cart
        - list [ref=e534]:
          - listitem [ref=e535]:
            - link "View Product" [ref=e536]:
              - /url: /product_details/37
      - generic [ref=e538]:
        - generic [ref=e539]:
          - generic [ref=e540]:
            - img "ecommerce website products"
            - heading "Rs. 2300" [level=2] [ref=e541]
            - paragraph [ref=e542]: Rose Pink Embroidered Maxi Dress
            - generic [ref=e543] [cursor=pointer]: Add to cart
          - generic [ref=e545]:
            - heading "Rs. 2300" [level=2] [ref=e546]
            - paragraph [ref=e547]: Rose Pink Embroidered Maxi Dress
            - generic [ref=e548] [cursor=pointer]: Add to cart
        - list [ref=e550]:
          - listitem [ref=e551]:
            - link "View Product" [ref=e552]:
              - /url: /product_details/38
      - generic [ref=e554]:
        - generic [ref=e555]:
          - generic [ref=e556]:
            - img "ecommerce website products"
            - heading "Rs. 3000" [level=2] [ref=e557]
            - paragraph [ref=e558]: Cotton Silk Hand Block Print Saree
            - generic [ref=e559] [cursor=pointer]: Add to cart
          - generic [ref=e561]:
            - heading "Rs. 3000" [level=2] [ref=e562]
            - paragraph [ref=e563]: Cotton Silk Hand Block Print Saree
            - generic [ref=e564] [cursor=pointer]: Add to cart
        - list [ref=e566]:
          - listitem [ref=e567]:
            - link "View Product" [ref=e568]:
              - /url: /product_details/39
      - generic [ref=e570]:
        - generic [ref=e571]:
          - generic [ref=e572]:
            - img "ecommerce website products"
            - heading "Rs. 3500" [level=2] [ref=e573]
            - paragraph [ref=e574]: Rust Red Linen Saree
            - generic [ref=e575] [cursor=pointer]: Add to cart
          - generic [ref=e577]:
            - heading "Rs. 3500" [level=2] [ref=e578]
            - paragraph [ref=e579]: Rust Red Linen Saree
            - generic [ref=e580] [cursor=pointer]: Add to cart
        - list [ref=e582]:
          - listitem [ref=e583]:
            - link "View Product" [ref=e584]:
              - /url: /product_details/40
      - generic [ref=e586]:
        - generic [ref=e587]:
          - generic [ref=e588]:
            - img "ecommerce website products"
            - heading "Rs. 5000" [level=2] [ref=e589]
            - paragraph [ref=e590]: Beautiful Peacock Blue Cotton Linen Saree
            - generic [ref=e591] [cursor=pointer]: Add to cart
          - generic [ref=e593]:
            - heading "Rs. 5000" [level=2] [ref=e594]
            - paragraph [ref=e595]: Beautiful Peacock Blue Cotton Linen Saree
            - generic [ref=e596] [cursor=pointer]: Add to cart
        - list [ref=e598]:
          - listitem [ref=e599]:
            - link "View Product" [ref=e600]:
              - /url: /product_details/41
      - generic [ref=e602]:
        - generic [ref=e603]:
          - generic [ref=e604]:
            - img "ecommerce website products"
            - heading "Rs. 1400" [level=2] [ref=e605]
            - paragraph [ref=e606]: Lace Top For Women
            - generic [ref=e607] [cursor=pointer]: Add to cart
          - generic [ref=e609]:
            - heading "Rs. 1400" [level=2] [ref=e610]
            - paragraph [ref=e611]: Lace Top For Women
            - generic [ref=e612] [cursor=pointer]: Add to cart
        - list [ref=e614]:
          - listitem [ref=e615]:
            - link "View Product" [ref=e616]:
              - /url: /product_details/42
      - generic [ref=e618]:
        - generic [ref=e619]:
          - generic [ref=e620]:
            - img "ecommerce website products"
            - heading "Rs. 1389" [level=2] [ref=e621]
            - paragraph [ref=e622]: GRAPHIC DESIGN MEN T SHIRT - BLUE
            - generic [ref=e623] [cursor=pointer]: Add to cart
          - generic [ref=e625]:
            - heading "Rs. 1389" [level=2] [ref=e626]
            - paragraph [ref=e627]: GRAPHIC DESIGN MEN T SHIRT - BLUE
            - generic [ref=e628] [cursor=pointer]: Add to cart
        - list [ref=e630]:
          - listitem [ref=e631]:
            - link "View Product" [ref=e632]:
              - /url: /product_details/43
  - contentinfo [ref=e633]:
    - generic [ref=e638]:
      - heading "Subscription" [level=2] [ref=e639]
      - generic [ref=e640]:
        - textbox "Your email address" [ref=e641]
        - button [ref=e642] [cursor=pointer]
        - paragraph [ref=e643]: Get the most recent updates from our site and be updated your self...
    - paragraph [ref=e647]: Copyright © 2021 All rights reserved
```

# Test source

```ts
  1   | import { expect, type Locator, type Page } from "@playwright/test";
  2   | 
  3   | export abstract class BaseAppPage {
  4   |   readonly page: Page;
  5   |   readonly header: Locator;
  6   |   readonly footer: Locator;
  7   |   readonly homeLink: Locator;
  8   |   readonly productsLink: Locator;
  9   |   readonly cartLink: Locator;
  10  |   readonly signupLoginLink: Locator;
  11  |   readonly testCasesLink: Locator;
  12  |   readonly apiTestingLink: Locator;
  13  |   readonly contactUsLink: Locator;
  14  |   readonly videoTutorialsLink: Locator;
  15  |   readonly logoutLink: Locator;
  16  |   readonly deleteAccountLink: Locator;
  17  |   readonly loggedInAs: Locator;
  18  |   readonly scrollUpButton: Locator;
  19  | 
  20  |   constructor(page: Page) {
  21  |     this.page = page;
  22  |     this.header = page.getByRole("banner");
  23  |     this.footer = page.getByRole("contentinfo");
  24  |     // Every nav link is scoped to the header rather than matched page-wide:
  25  |     // "Cart"'s accessible name carries a leading space from its icon markup,
  26  |     // which exact matching does not trim, and several of these names are also
  27  |     // used elsewhere on the page (the hero's own "Test Cases" button, the
  28  |     // add-to-cart modal's "View Cart" link) that an unscoped match would also
  29  |     // resolve to. Verified live.
  30  |     this.homeLink = this.header.getByRole("link", { name: "Home" });
  31  |     this.productsLink = this.header.getByRole("link", { name: "Products" });
  32  |     this.cartLink = this.header.getByRole("link", { name: "Cart" });
  33  |     this.signupLoginLink = this.header.getByRole("link", {
  34  |       name: "Signup / Login",
  35  |     });
  36  |     this.testCasesLink = this.header.getByRole("link", { name: "Test Cases" });
  37  |     this.apiTestingLink = this.header.getByRole("link", {
  38  |       name: "API Testing",
  39  |     });
  40  |     this.contactUsLink = this.header.getByRole("link", { name: "Contact us" });
  41  |     this.videoTutorialsLink = this.header.getByRole("link", {
  42  |       name: "Video Tutorials",
  43  |     });
  44  |     this.logoutLink = this.header.getByRole("link", { name: "Logout" });
  45  |     this.deleteAccountLink = this.header.getByRole("link", {
  46  |       name: "Delete Account",
  47  |     });
  48  |     this.loggedInAs = page.getByText("Logged in as");
  49  |     // No text and no role: a decorative anchor the scrollUp plugin injects.
  50  |     this.scrollUpButton = page.locator("#scrollUp");
  51  |   }
  52  | 
  53  |   /**
  54  |    * No consent-dismiss step here: `testFixtures.ts` blocks
  55  |    * `fundingchoicesmessages`, the host that would render that banner, as
  56  |    * third-party noise. A banner that can never load has nothing to dismiss —
  57  |    * verified against all 78 published browser-driven results, every one
  58  |    * carrying the same doomed three-second wait.
  59  |    */
  60  |   protected async goto(path: string): Promise<void> {
> 61  |     await this.page.goto(path);
      |                     ^ Error: page.goto: Test timeout of 30000ms exceeded.
  62  |   }
  63  | 
  64  |   /**
  65  |    * Resolves once every image inside the scope has finished decoding.
  66  |    *
  67  |    * Product photography streams in after load, so a region holding it keeps
  68  |    * reflowing. A screenshot assertion waits for stability, and under parallel
  69  |    * load that wait can expire mid-arrival, failing on stability rather than on
  70  |    * any visual difference. Waiting for the images fixes the cause; a longer
  71  |    * screenshot timeout only moves the deadline. A broken image settles through
  72  |    * its error event, so it cannot hang this.
  73  |    */
  74  |   async waitForImagesLoaded(scope: Locator): Promise<void> {
  75  |     await scope.evaluate(async (element: HTMLElement) => {
  76  |       const images: HTMLImageElement[] = Array.from(
  77  |         element.querySelectorAll("img"),
  78  |       );
  79  |       await Promise.all(
  80  |         images.map((image) =>
  81  |           image.complete && image.naturalWidth > 0
  82  |             ? Promise.resolve()
  83  |             : new Promise((resolve) => {
  84  |                 image.addEventListener("load", resolve, { once: true });
  85  |                 image.addEventListener("error", resolve, { once: true });
  86  |               }),
  87  |         ),
  88  |       );
  89  |     });
  90  |   }
  91  | 
  92  |   /**
  93  |    * Aligns an element to the top of the viewport.
  94  |    *
  95  |    * `scrollIntoViewIfNeeded` scrolls the minimum distance required, so where it
  96  |    * lands depends on where the page already was. A visual capture of the
  97  |    * viewport needs the same framing every run, which this guarantees.
  98  |    */
  99  |   async scrollToTop(target: Locator): Promise<void> {
  100 |     // Where the target lands depends on layout, which is only final once the
  101 |     // document, stylesheets included, has loaded.
  102 |     await this.page.waitForLoadState("load");
  103 |     await target.evaluate((element: Element) =>
  104 |       element.scrollIntoView({ block: "start", behavior: "instant" }),
  105 |     );
  106 |   }
  107 | 
  108 |   /**
  109 |    * The smallest rectangle enclosing every given locator's own box, for a
  110 |    * `page.screenshot({ clip })` capture spanning elements with no single
  111 |    * existing container tight enough to scope to directly, such as a heading
  112 |    * and the block it titles when the two are rendered as plain siblings.
  113 |    */
  114 |   async unionBoundingBox(
  115 |     locators: Locator[],
  116 |   ): Promise<{ x: number; y: number; width: number; height: number }> {
  117 |     // A clip is computed from layout, and layout is only final once the
  118 |     // document, stylesheets included, has loaded.
  119 |     await this.page.waitForLoadState("load");
  120 |     const boxes = await Promise.all(
  121 |       locators.map((locator) => locator.boundingBox()),
  122 |     );
  123 |     const resolved = boxes.filter((box) => box !== null);
  124 |     const left = Math.min(...resolved.map((box) => box.x));
  125 |     const top = Math.min(...resolved.map((box) => box.y));
  126 |     const right = Math.max(...resolved.map((box) => box.x + box.width));
  127 |     const bottom = Math.max(...resolved.map((box) => box.y + box.height));
  128 |     return { x: left, y: top, width: right - left, height: bottom - top };
  129 |   }
  130 | 
  131 |   /**
  132 |    * Waits until a locator's own bounding box stops changing between two
  133 |    * consecutive reads, for content whose *presence* is a poor proxy for its
  134 |    * *final size* — a Bootstrap accordion panel, for instance, keeps pushing
  135 |    * later siblings down for a moment after the panel's own text is already
  136 |    * visible, verified live: a `unionBoundingBox` taken right after that text
  137 |    * appears can still miss a sibling that has not finished being pushed into
  138 |    * place. `animations: "disabled"` does not cover this, since the sibling is
  139 |    * being repositioned by the transitioning element's layout, not animating
  140 |    * itself.
  141 |    */
  142 |   async waitForStableBoundingBox(locator: Locator): Promise<void> {
  143 |     let previousHeight: number | null = null;
  144 |     await expect(async () => {
  145 |       const box = await locator.boundingBox();
  146 |       const stable = box !== null && box.height === previousHeight;
  147 |       previousHeight = box?.height ?? null;
  148 |       expect(stable).toBe(true);
  149 |     }).toPass();
  150 |   }
  151 | 
  152 |   /**
  153 |    * Scrolls with the wheel rather than the API on purpose. The control is fixed
  154 |    * at a negative offset until the plugin animates it in, and it listens for a
  155 |    * real scroll: `window.scrollTo` leaves it off screen and unclickable.
  156 |    */
  157 |   async scrollDownAndReturnToTop(): Promise<void> {
  158 |     await this.page.mouse.wheel(0, 2500);
  159 |     await this.scrollUpButton.click();
  160 |   }
  161 | 
```