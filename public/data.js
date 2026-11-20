/* ── Menu data ─────────────────────────────────────────────────────────────── */

export const MENU = [
 // COCKTAILS
 {id:"mezcalita",cat:"Cocktails",name:"Mezcalita",price:"£12",spirit:"Pensador Espadín Mezcal",ingredients:["Pensador Espadín Mezcal","Cointreau","Jalapeño","Pineapple","Lime","Hibiscus"],note:"",spec:""},
 {id:"margarita",cat:"Cocktails",name:"Margarita",price:"£11",spirit:"Tequila Ocho Plata",ingredients:["Tequila Ocho Plata","Cointreau","Lime"],note:"Salt OR Tajín rim. Classic or spicy.",spec:"",qa:[{q:"Which rims can the guest choose for a Margarita?",a:"Salt or Tajín",w:["Sweet & salty","Chilli sugar","No rim, ever"]},{q:"How can a guest have their Margarita?",a:"Classic or spicy",w:["Frozen or on the rocks","Classic only","Sweet or dry"]}]},
 {id:"mezcalmarg",cat:"Cocktails",name:"Mezcal Marg",price:"£12",spirit:"Pensador Espadín Mezcal",ingredients:["Pensador Espadín Mezcal","Cointreau","Lime"],note:"Mezcal version of the Margarita. Salt OR Tajín rim, classic or spicy.",spec:""},
 {id:"tommys",cat:"Cocktails",name:"Tommy's",price:"£11",spirit:"Tequila Ocho Plata",ingredients:["Tequila Ocho Plata","Agave","Lime"],note:"No Cointreau: agave does the sweetening.",spec:""},
 {id:"smokeytommys",cat:"Cocktails",name:"Smokey Tommy's",price:"£12",spirit:"Pensador Espadín Mezcal",ingredients:["Pensador Espadín Mezcal","Agave","Lime"],note:"Tommy's made with mezcal.",spec:""},
 {id:"palomita",cat:"Cocktails",name:"Palomita",price:"£12",spirit:"Ojo de Dios hibiscus mezcal",ingredients:["Ojo de Dios hibiscus mezcal","King's Ginger liqueur","Grapefruit sherbet","Lime"],note:"Sweet & salty rim.",spec:"",qa:[{q:"What rim does the Palomita get?",a:"Sweet & salty",w:["Salt","Tajín","No rim"]}]},
 {id:"coqueta",cat:"Cocktails",name:"La Coqueta",price:"£12",spirit:"Condesa Prickly Pear Gin",ingredients:["Condesa Prickly Pear Gin","Burnt Faith Elderflower vermouth","Raspberry cucumber dill pickle cordial","Schweppes soda"],note:"The only gin cocktail on the list.",spec:"",qa:[{q:"Which cocktail is the only one made with gin?",a:"La Coqueta",w:["Palomita","Jalisco Mule","Mezcalita"]}]},
 {id:"jaliscomule",cat:"Cocktails",name:"Jalisco Mule",price:"£11",spirit:"Tequila Ocho Reposado",ingredients:["Tequila Ocho Reposado","Schweppes ginger beer","Fresh lime"],note:"The only cocktail using reposado (aged) tequila.",spec:"",qa:[{q:"Which tequila goes in the Jalisco Mule?",a:"Tequila Ocho Reposado",w:["Tequila Ocho Plata","Pensador Espadín Mezcal","Ojo de Dios hibiscus mezcal"]}]},
 {id:"espresso",cat:"Cocktails",name:"Espresso Martini de la Olla",price:"£12",spirit:"Tequila Ocho Plata OR Finlandia vodka",ingredients:["Tequila Ocho Plata OR Finlandia vodka","Kahlúa","Home-brewed café de olla"],note:"Café de olla is brewed in-house with cinnamon, orange peel, piloncillo & spices.",spec:"",qa:[{q:"What goes into the house café de olla?",a:"Cinnamon, orange peel, piloncillo & spices",w:["Vanilla, cardamom & brown sugar","Cinnamon, chocolate & chilli","Star anise, lemon peel & honey"]},{q:"Which two base spirits can a guest pick for the Espresso Martini de la Olla?",a:"Tequila Ocho Plata or Finlandia vodka",w:["Mezcal or vodka","Reposado or rum","Finlandia vodka only"]}]},
 // HAPPY HOUR
 {id:"hh-info",cat:"Happy hour",name:"Happy hour",price:"£8",spirit:"",ingredients:[],note:"£8 before 8pm: Ocho Margarita and Ocho Tommy's.",spec:"",qa:[{q:"When does happy hour end?",a:"8pm",w:["7pm","9pm","6pm"]},{q:"How much are happy-hour cocktails?",a:"£8",w:["£7","£9","£6.50"]},{q:"Which two drinks are on happy hour?",a:"Ocho Margarita & Ocho Tommy's",w:["Mezcalita & Palomita","Margarita & Jalisco Mule","Ocho Margarita & Mezcal Marg"]}]},
 {id:"ochomarg",cat:"Happy hour",name:"Ocho Margarita",price:"£8 happy hour",spirit:"Tequila Ocho Plata",ingredients:["Tequila Ocho Plata","Cointreau","Lime"],note:"Classic or spicy!",spec:""},
 {id:"ochotommys",cat:"Happy hour",name:"Ocho Tommy's",price:"£8 happy hour",spirit:"Ocho Blanco tequila",ingredients:["Ocho Blanco tequila","Lime","Agave"],note:"Blanco and Plata are the same style: unaged tequila.",spec:""},
 // SHOTS
 {id:"verdita",cat:"Shots",name:"Verdita",price:"£7",spirit:"Ocho Blanco tequila",ingredients:["Ocho Blanco tequila","Verdita chaser"],note:"Caballito (shot) + chaser.",spec:""},
 {id:"bebeguinness",cat:"Shots",name:"Bebé Guinness",price:"£7",spirit:"Licor 43 Horchata",ingredients:["Licor 43 Horchata liqueur","Kahlúa coffee liqueur"],note:"No tequila or mezcal in this one.",spec:""},
 {id:"picoback",cat:"Shots",name:"Pico Back",price:"£7",spirit:"Pensador Espadín Mezcal",ingredients:["Pensador Espadín Mezcal","Spicy jalapeño brine chaser"],note:"Mezcal shot with a pickleback-style chaser.",spec:""},
 {id:"mm",cat:"Shots",name:"M&M",price:"£7",spirit:"Pensador Espadín Mezcal",ingredients:["Pensador Espadín Mezcal","Montenegro"],note:"Served ice cold. A CDMX favourite.",spec:"",qa:[{q:"How is the M&M served?",a:"Ice cold",w:["With a chaser","Flaming","With a Tajín rim"]}]},
 {id:"spirits-info",cat:"Shots",name:"Spirit list",price:"",spirit:"",ingredients:[],note:"Over 100 Mexican & agave distillates: ask for the full list. All spirits come in 200ml sharing carafes.",spec:"",qa:[{q:"Roughly how many Mexican & agave distillates does the Cantina carry?",a:"Over 100",w:["About 30","About 50","Over 250"]},{q:"What size are the spirit sharing carafes?",a:"200ml",w:["500ml","100ml","350ml"]}]},
 // 0%
 {id:"palomafresca",cat:"0%",name:"Paloma Fresca",price:"£8.5",spirit:"Lyre's agave spirit 0%",ingredients:["Lyre's agave spirit 0%","Three Spirit Livener","Schweppes Pink soda","Citrus","Rock salt"],note:"Alcohol-free.",spec:""},
 {id:"margcero",cat:"0%",name:"Margarita Cero",price:"£8",spirit:"Lyre's agave spirit 0%",ingredients:["Lyre's agave spirit 0%","Fresh lime","Fresh pineapple","Agave"],note:"Alcohol-free.",spec:""},
 {id:"aperolcero",cat:"0%",name:"Aperol Spritz Cero",price:"£7",spirit:"Lyre's Italian Spritz",ingredients:["Lyre's Italian Spritz","Schweppes soda","Fresh orange"],note:"Alcohol-free.",spec:""},
 {id:"cantarito",cat:"0%",name:"Cantarito Cero",price:"£8",spirit:"",ingredients:["Grapefruit","Orange","Lime","Grapefruit soda top"],note:"Served in a typical clay cup.",spec:"",qa:[{q:"What is the Cantarito Cero served in?",a:"A clay cup",w:["A copper mug","A highball","A coupe"]}]},
 // SOFTS
 {id:"jarritos",cat:"Softs",name:"Jarritos",price:"£4.50",spirit:"",ingredients:["Flavoured Mexican soda"],note:"Ask for flavours.",spec:""},
 {id:"squirt",cat:"Softs",name:"Squirt",price:"£4.50",spirit:"",ingredients:["Mexican grapefruit soda"],note:"",spec:""},
 {id:"electrolit",cat:"Softs",name:"Electrolit",price:"£4.50",spirit:"",ingredients:["Electrolyte drink"],note:"Ask for flavours.",spec:""},
 // BEER
 {id:"caguamas",cat:"Beer",name:"Caguamas",price:"£23",spirit:"",ingredients:["Tecate Light lager","1.2L bottle"],note:"For sharing (or not!). Imported directly from Mexico.",spec:"",qa:[{q:"Which beer comes as a 1.2L Caguama?",a:"Tecate Light",w:["Modelo","Corona","Pacifico"]}]},
 {id:"modelo",cat:"Beer",name:"Modelo",price:"£7",spirit:"",ingredients:["Draught","Lager","4.5%"],note:"",spec:""},
 {id:"corona",cat:"Beer",name:"Corona",price:"£6.5",spirit:"",ingredients:["Draught","Lager","4.5%"],note:"",spec:""},
 {id:"dosequis",cat:"Beer",name:"Dos Equis",price:"£6",spirit:"",ingredients:["Bottle","Lager","4.5%"],note:"",spec:""},
 {id:"pacifico",cat:"Beer",name:"Pacifico",price:"£6.5",spirit:"",ingredients:["Bottle","Lager","4.5%"],note:"",spec:""},
 {id:"victoria",cat:"Beer",name:"Victoria",price:"£7",spirit:"",ingredients:["Bottle","Lager","4%"],note:"",spec:""},
 {id:"modelonegra",cat:"Beer",name:"Modelo Negra",price:"£8",spirit:"",ingredients:["Bottle","Dark lager","5.4%"],note:"The only dark beer.",spec:""},
 {id:"coronacero",cat:"Beer",name:"Corona Cero",price:"£5",spirit:"",ingredients:["Bottle","Lager","0.0%"],note:"",spec:""},
 {id:"michelada",cat:"Beer",name:"Michelada upgrade",price:"Clamato Michelada +£2 · Chelada +£1",spirit:"",ingredients:["Any bottled beer"],note:"Add to any bottled beer.",spec:"",qa:[{q:"How much is the Clamato Michelada upgrade?",a:"+£2",w:["+£1","+£3","+£1.50"]},{q:"How much is the Chelada upgrade?",a:"+£1",w:["+£2","+£0.50","+£1.50"]}]},
 {id:"cubetazo",cat:"Beer",name:"Cubetazo",price:"",spirit:"",ingredients:["5 bottled beers","Bucket of ice"],note:"Beer bucket: any 5 bottled beers on ice.",spec:"",qa:[{q:"How many beers come in a Cubetazo?",a:"5",w:["4","6","3"]}]},
 {id:"beer-draught",cat:"Beer",name:"Draught vs bottle",price:"",spirit:"",ingredients:[],note:"Draught: Modelo, Corona. Everything else is bottled.",spec:"",qa:[{q:"Which two beers are on draught?",a:"Modelo & Corona",w:["Modelo & Pacifico","Corona & Dos Equis","Victoria & Modelo Negra"]}]},
 // WINE
 {id:"red",cat:"Wine",name:"Red",price:"£8.5 / £11",spirit:"",ingredients:["Sangiovese/Merlot","Italy"],note:"175ml / 250ml. 500ml carafes available.",spec:""},
 {id:"white",cat:"Wine",name:"White",price:"£8.5 / £11",spirit:"",ingredients:["Picpoul","France"],note:"175ml / 250ml. 500ml carafes available.",spec:""},
 {id:"sparkling",cat:"Wine",name:"Sparkling",price:"£35 bottle",spirit:"",ingredients:["Prosecco","Italy"],note:"",spec:""},
 // FOOD
 {id:"birria",cat:"Food",name:"Birria Taco",price:"£13",spirit:"",ingredients:["Beef birria short rib OR grilled artichoke","Birria broth on the side","Corn tortilla"],note:"Two pieces. +£2 grilled cheese.",spec:""},
 {id:"cactus",cat:"Food",name:"Cactus Taco",price:"£13",spirit:"",ingredients:["Grilled cactus","Onions","Tomatoes","Coriander","Salsa verde","Queso fresco"],note:"Two pieces.",spec:""},
 {id:"carnitas",cat:"Food",name:"Carnitas Taco",price:"£14",spirit:"",ingredients:["Pork cooked in manteca madre","Refried beans","Salsa martajada","Gualsa","Onion","Coriander"],note:"Two pieces.",spec:""},
 {id:"suadero",cat:"Food",name:"Suadero Tacos",price:"£14",spirit:"",ingredients:["Beef cooked with lard","Frijoles de la olla","Salsa verde","Onion","Coriander"],note:"Two pieces.",spec:""},
 {id:"pollomamon",cat:"Food",name:"Pollo Mamón Tacos",price:"£14",spirit:"",ingredients:["Jerk chicken","Salsa martajada","Plátano macho"],note:"Two pieces.",spec:""},
 {id:"madre",cat:"Food",name:"Madre Tostada",price:"£8",spirit:"",ingredients:["Oaxaca-style beans","Oaxaca cheese","Lettuce","Gualsa","Grasshopper salt (optional)"],note:"Single piece.",spec:""},
 {id:"salmoncita",cat:"Food",name:"Salmoncita Tostada",price:"£11",spirit:"",ingredients:["Cooked salmon ceviche (ginger, lime, salsa negra)","Japanese peanut salsa macha","Avocado","Coriander","Basil"],note:"Single piece. Contains peanuts.",spec:""},
 {id:"camaron",cat:"Food",name:"Camarón Tostada",price:"£9",spirit:"",ingredients:["Cooked prawn ceviche","Cucumber","Bed of guac","Chipotle mayo","Salsa macha"],note:"Single piece.",spec:""},
 {id:"guac",cat:"Food",name:"Guacamole",price:"£8.5",spirit:"",ingredients:["Avocado","Onion","Jalapeño","Lime","Fresh tomato"],note:"Botana, served with totopos.",spec:""},
 {id:"chacha",cat:"Food",name:"Chacha Beans",price:"£7.5",spirit:"",ingredients:["Refried beans","Fresh cheese","Chorizo"],note:"Botana, served with totopos.",spec:""},
 {id:"oaxacan",cat:"Food",name:"Oaxacan Beans",price:"£9",spirit:"",ingredients:["Refried black beans","Huitlacoche","Hoja santa","Avocado leaf","Queso Oaxaca"],note:"Botana, served with totopos.",spec:""},
 {id:"martajada",cat:"Food",name:"Salsa Martajada",price:"£5",spirit:"",ingredients:["Charred tomatoes","Jalapeños","Garlic","Lime"],note:"Botana, served with totopos.",spec:""},
 {id:"durritos",cat:"Food",name:"Durritos",price:"£4.5",spirit:"",ingredients:["Salted Mexican wheat crisps","Valentina hot sauce","Fresh lime"],note:"",spec:""},
 {id:"palomitas",cat:"Food",name:"Palomitas con Tajín",price:"£3",spirit:"",ingredients:["Popcorn in coconut oil","Tajín"],note:"",spec:""},
 {id:"velrosita",cat:"Food",name:"Vel Rosita (extra heat)",price:"£2",spirit:"",ingredients:["Beetroot","Habanero","Árbol","Pickled red onions"],note:"Allergen: sulphites.",spec:""},
 {id:"macha",cat:"Food",name:"Daniel's Salsa Macha (extra heat)",price:"£3",spirit:"",ingredients:["Olive oil","Árbol chilli","Sesame seeds","Garlic"],note:"Allergen: sesame.",spec:""},
 {id:"escabeche",cat:"Food",name:"Jalapeños en Escabeche (extra heat)",price:"£2",spirit:"",ingredients:["Pickled jalapeños","Chilli"],note:"Allergen: sulphites.",spec:""},
 {id:"maya",cat:"Food",name:"Salsa Maya (extra heat)",price:"£2",spirit:"",ingredients:["Charred green habanero salsa"],note:"",spec:""},
 {id:"kitchen",cat:"Food",name:"Kitchen hours",price:"",spirit:"",ingredients:[],note:"Kitchen 7pm–10.30pm. Vegan option on request. Always ask about allergies.",spec:"",qa:[{q:"What are the Cantina kitchen hours?",a:"7pm–10.30pm",w:["6pm–11pm","7pm–midnight","5pm–10pm"]},{q:"Which extra-heat salsa contains sesame?",a:"Daniel's Salsa Macha",w:["Vel Rosita","Salsa Maya","Jalapeños en Escabeche"]}]}
];
MENU.forEach(i => i.folder = "cantina");

/* ── Top 50 classics ───────────────────────────────────────────────────────── */

const VID = "https://www.youtube.com/watch?v=AWnIqpsfyPU&t=";
const C = (id,cat,name,t,spirit,ingredients,spec,method,glass,garnish,note="") =>
  ({id:"c-"+id,folder:"classics",cat,name,price:"",spirit,ingredients,spec,method,glass,garnish,note,video:VID+t+"s"});

export const CLASSICS = [
 C("oldfashioned","Whiskey","Old Fashioned",38,"Bourbon or rye",["Bourbon or rye","Sugar","Angostura bitters"],"60ml bourbon or rye\n1 sugar cube or 7.5ml simple syrup\n2–3 dashes Angostura","Stir","Rocks glass, large cube","Orange peel"),
 C("manhattan","Whiskey","Manhattan",89,"Rye whiskey",["Rye whiskey","Sweet vermouth","Angostura bitters"],"60ml rye\n30ml sweet vermouth\n2 dashes Angostura","Stir","Coupe, no ice","Cocktail cherry"),
 C("sazerac","Whiskey","Sazerac",123,"Rye whiskey (or cognac)",["Rye whiskey","Sugar","Peychaud's bitters","Absinthe rinse"],"60ml rye (or cognac)\n1 sugar cube or 7.5ml simple\n3 dashes Peychaud's\nAbsinthe rinse","Stir","Chilled rocks glass, no ice","Lemon peel, expressed and discarded"),
 C("negroni","Gin","Negroni",161,"Gin",["Gin","Campari","Sweet vermouth"],"30ml gin\n30ml Campari\n30ml sweet vermouth","Stir","Rocks glass, ice","Orange peel or slice","Equal parts."),
 C("julep","Whiskey","Mint Julep",188,"Bourbon",["Bourbon","Simple syrup","Mint"],"60ml bourbon\n10ml simple syrup\n8–10 mint leaves","Gently muddle mint, build","Julep cup, crushed ice","Mint sprig"),
 C("tomcollins","Gin","Tom Collins",234,"Gin",["Gin","Lemon juice","Simple syrup","Soda water"],"50ml gin\n25ml lemon\n15ml simple\nTop soda","Shake (or build), top with soda","Collins glass, ice","Lemon wheel & cherry"),
 C("margarita","Agave","Margarita",269,"Tequila blanco",["Tequila blanco","Cointreau","Lime juice"],"50ml tequila blanco\n25ml Cointreau\n25ml lime","Shake","Rocks glass or coupe, salt rim optional","Lime wedge"),
 C("daiquiri","Rum & cachaça","Daiquiri",307,"White rum",["White rum","Lime juice","Simple syrup"],"60ml white rum\n25ml lime\n15ml simple","Shake","Coupe","Lime wheel"),
 C("martini","Gin","Martini",328,"Gin",["Gin","Dry vermouth"],"60ml gin\n15ml dry vermouth\n(optional dash orange bitters)","Stir","Chilled martini glass or coupe","Lemon twist or olive"),
 C("brandyalex","Brandy & pisco","Brandy Alexander",355,"Cognac",["Cognac","Crème de cacao","Cream"],"30ml cognac\n30ml dark crème de cacao\n30ml cream","Shake","Coupe","Grated nutmeg"),
 C("improved","Whiskey","Improved Whiskey Cocktail",385,"Rye or bourbon",["Rye or bourbon","Simple syrup","Maraschino liqueur","Angostura bitters","Absinthe rinse"],"60ml rye or bourbon\n5ml simple\n5ml maraschino\n2 dashes Angostura\nAbsinthe rinse","Stir","Rocks glass","Lemon twist"),
 C("rickey","Gin","Gin Rickey",417,"Gin",["Gin","Lime juice","Soda water"],"60ml gin\n15–25ml lime\nTop soda","Build","Highball, ice","Lime shell","No sugar: dry and tart."),
 C("paloma","Agave","Paloma",438,"Tequila",["Tequila","Lime juice","Salt","Grapefruit soda"],"50ml tequila\n15ml lime\nPinch salt\nTop grapefruit soda","Build","Highball, ice, salt rim optional","Grapefruit or lime wedge"),
 C("beesknees","Gin","Bee's Knees",466,"Gin",["Gin","Lemon juice","Honey syrup"],"60ml gin\n22.5ml lemon\n22.5ml honey syrup","Shake","Coupe","Lemon twist"),
 C("montecarlo","Whiskey","Monte Carlo",492,"Rye whiskey",["Rye whiskey","Bénédictine","Angostura bitters"],"60ml rye\n15ml Bénédictine\n2 dashes Angostura","Stir","Coupe or rocks glass","Lemon twist"),
 C("boulevardier","Whiskey","Boulevardier",519,"Bourbon",["Bourbon","Campari","Sweet vermouth"],"45ml bourbon\n30ml Campari\n30ml sweet vermouth","Stir","Coupe or rocks glass","Orange twist","A Negroni with bourbon instead of gin."),
 C("maitai","Rum & cachaça","Mai Tai",544,"Aged rum",["Aged Jamaican rum","Aged Martinique rum","Orange curaçao","Orgeat","Lime juice"],"30ml aged Jamaican rum\n30ml aged Martinique rum\n15ml orange curaçao\n15ml orgeat\n25ml lime","Shake","Double rocks, crushed ice","Mint sprig & spent lime shell"),
 C("aperol","Aperitivo & wine","Aperol Spritz",584,"Aperol",["Prosecco","Aperol","Soda water"],"90ml prosecco\n60ml Aperol\n30ml soda (3-2-1)","Build","Wine glass, ice","Orange slice"),
 C("champagne","Aperitivo & wine","Champagne Cocktail",606,"Champagne",["Sugar cube","Angostura bitters","Champagne"],"1 sugar cube soaked in Angostura\nTop ~100ml champagne","Build","Flute","Lemon twist"),
 C("pinklady","Gin","Pink Lady",639,"Gin",["Gin","Applejack","Lemon juice","Grenadine","Egg white"],"45ml gin\n15ml applejack\n15ml lemon\n15ml grenadine\n1 egg white","Dry shake, then shake with ice","Coupe","Cherry"),
 C("jackrose","Brandy & pisco","Jack Rose",679,"Applejack (apple brandy)",["Applejack","Lemon juice","Grenadine"],"60ml applejack\n22.5ml lemon\n15ml grenadine","Shake","Coupe","Lemon twist or apple slice"),
 C("caipirinha","Rum & cachaça","Caipirinha",702,"Cachaça",["Cachaça","Lime wedges","Sugar"],"60ml cachaça\n½ lime in wedges\n2 tsp sugar","Muddle lime & sugar, build","Rocks glass, crushed ice","Lime"),
 C("firingsquad","Agave","Mexican Firing Squad Special",734,"Tequila blanco",["Tequila blanco","Lime juice","Grenadine","Angostura bitters"],"60ml tequila blanco\n22.5ml lime\n15–22.5ml grenadine\n3–4 dashes Angostura","Shake","Rocks glass, ice","Lime wheel & cherry"),
 C("lastword","Gin","Last Word",766,"Gin",["Gin","Green Chartreuse","Maraschino liqueur","Lime juice"],"22.5ml gin\n22.5ml green Chartreuse\n22.5ml maraschino\n22.5ml lime","Shake","Coupe","Cherry (or none)","Equal parts."),
 C("sidecar","Brandy & pisco","Sidecar",795,"Cognac",["Cognac","Cointreau","Lemon juice"],"50ml cognac\n20ml Cointreau\n20ml lemon","Shake","Coupe, sugar rim optional","Orange twist"),
 C("mojito","Rum & cachaça","Mojito",829,"White rum",["White rum","Lime juice","Sugar","Mint","Soda water"],"50ml white rum\n25ml lime\n15–20ml simple (or 2 tsp sugar)\n6–8 mint leaves\nTop soda","Gently muddle mint, build, top with soda","Highball, crushed ice","Mint sprig"),
 C("corpse","Gin","Corpse Reviver No. 2",900,"Gin",["Gin","Cointreau","Lillet Blanc","Lemon juice","Absinthe rinse"],"22.5ml gin\n22.5ml Cointreau\n22.5ml Lillet Blanc\n22.5ml lemon\nAbsinthe rinse","Shake","Coupe","Orange twist (or none)","Equal parts."),
 C("gimlet","Gin","Gimlet",936,"Gin",["Gin","Lime juice","Simple syrup"],"60ml gin\n22.5ml lime\n15ml simple\n(or 22.5ml lime cordial)","Shake","Coupe","Lime wheel"),
 C("martinez","Gin","Martinez",958,"Old Tom gin",["Old Tom gin","Sweet vermouth","Maraschino liqueur","Bitters"],"45ml Old Tom gin\n45ml sweet vermouth\n5–7.5ml maraschino\n2 dashes orange or Angostura bitters","Stir","Coupe","Orange twist"),
 C("singapore","Gin","Singapore Sling",991,"Gin",["Gin","Cherry liqueur","Cointreau","Bénédictine","Pineapple juice","Lime juice","Grenadine","Angostura bitters"],"30ml gin\n15ml cherry liqueur (Heering)\n7.5ml Cointreau\n7.5ml Bénédictine\n120ml pineapple\n15ml lime\n10ml grenadine\nDash Angostura","Shake","Highball or hurricane, ice","Pineapple & cherry"),
 C("silverfizz","Gin","Silver Fizz",1025,"Gin",["Gin","Lemon juice","Simple syrup","Egg white","Soda water"],"60ml gin\n25ml lemon\n20ml simple\n1 egg white\nTop soda","Dry shake, shake with ice, top with soda","Fizz glass or small highball, no ice","None (or lemon peel)","A Gin Fizz with egg white."),
 C("daisy","Brandy & pisco","Daisy",1069,"Brandy (classic) or gin",["Brandy","Lemon juice","Orange liqueur","Soda water"],"60ml brandy\n22.5ml lemon\n15ml orange liqueur\nSplash soda","Shake, splash of soda","Coupe or rocks glass","Lemon or orange twist","A family of drinks: the Margarita is a tequila daisy (margarita is Spanish for daisy)."),
 C("junglebird","Rum & cachaça","Jungle Bird",1095,"Blackstrap rum",["Blackstrap rum","Campari","Pineapple juice","Lime juice","Demerara syrup"],"45ml blackstrap rum\n22.5ml Campari\n45ml pineapple\n15ml lime\n15ml demerara syrup","Shake","Rocks glass, ice","Pineapple wedge or leaves"),
 C("americano","Aperitivo & wine","Americano",1134,"Campari",["Campari","Sweet vermouth","Soda water"],"30ml Campari\n30ml sweet vermouth\nTop soda","Build","Highball or rocks glass, ice","Orange slice"),
 C("bamboo","Aperitivo & wine","Bamboo",1172,"Fino or amontillado sherry",["Dry sherry","Dry vermouth","Orange bitters","Angostura bitters"],"45ml fino or amontillado sherry\n45ml dry vermouth\n2 dashes orange bitters\n1 dash Angostura","Stir","Coupe","Lemon twist"),
 C("darknstormy","Rum & cachaça","Dark 'n Stormy",1205,"Gosling's Black Seal rum",["Dark rum","Ginger beer","Lime"],"60ml Gosling's Black Seal\nTop ginger beer (~120ml)","Build, rum floated on top","Highball, ice","Lime wedge"),
 C("smash","Whiskey","Whiskey Smash",1228,"Bourbon",["Bourbon","Lemon wedges","Simple syrup","Mint"],"60ml bourbon\n½ lemon in wedges\n15–22.5ml simple\n6–8 mint leaves","Muddle lemon, shake with mint","Rocks glass, crushed ice","Mint sprig"),
 C("ginfix","Gin","Gin Fix",1273,"Gin",["Gin","Lemon juice","Simple syrup"],"60ml gin\n22.5ml lemon\n15ml simple (classically pineapple syrup)","Shake","Rocks glass, crushed ice","Seasonal fruit or lemon"),
 C("vesper","Gin","Vesper",1298,"Gin",["Gin","Vodka","Lillet Blanc"],"45ml gin\n15ml vodka\n7.5ml Lillet Blanc","Shake (Bond's way) or stir","Martini glass or coupe","Lemon peel","James Bond's martini from Casino Royale."),
 C("20thcentury","Gin","20th Century",1319,"Gin",["Gin","Lillet Blanc","White crème de cacao","Lemon juice"],"45ml gin\n22.5ml Lillet Blanc\n15ml white crème de cacao\n22.5ml lemon","Shake","Coupe","Lemon twist"),
 C("french75","Gin","French 75",1352,"Gin",["Gin","Lemon juice","Simple syrup","Champagne"],"30ml gin\n15ml lemon\n15ml simple\nTop champagne (~60ml)","Shake, strain, top with champagne","Flute","Lemon twist"),
 C("aviation","Gin","Aviation",1388,"Gin",["Gin","Maraschino liqueur","Crème de violette","Lemon juice"],"60ml gin\n15ml maraschino\n7.5ml crème de violette\n22.5ml lemon","Shake","Coupe","Cherry"),
 C("ryebuck","Whiskey","Rye Buck",1420,"Rye whiskey",["Rye whiskey","Lemon or lime juice","Ginger beer"],"60ml rye\n15ml lemon or lime\nTop ginger beer or ginger ale","Build","Highball, ice","Lemon or lime wedge","A 'buck' is spirit + citrus + ginger."),
 C("moscowmule","Vodka","Moscow Mule",1452,"Vodka",["Vodka","Lime juice","Ginger beer"],"50ml vodka\n15ml lime\nTop ginger beer (~120ml)","Build","Copper mug, ice","Lime wedge"),
 C("kangaroo","Vodka","Kangaroo",1483,"Vodka",["Vodka","Dry vermouth"],"60ml vodka\n15ml dry vermouth","Stir","Martini glass or coupe","Lemon twist or olive","The original name for a vodka martini."),
 C("hemingway","Rum & cachaça","Hemingway Daiquiri",1512,"White rum",["White rum","Lime juice","Grapefruit juice","Maraschino liqueur"],"60ml white rum\n22.5ml lime\n15ml grapefruit\n7.5–15ml maraschino","Shake","Coupe","Lime wheel"),
 C("vieuxcarre","Whiskey","Vieux Carré",1541,"Rye & cognac",["Rye whiskey","Cognac","Sweet vermouth","Bénédictine","Peychaud's bitters","Angostura bitters"],"22.5ml rye\n22.5ml cognac\n22.5ml sweet vermouth\n7.5ml Bénédictine\n2 dashes Peychaud's\n2 dashes Angostura","Stir","Rocks glass, ice","Lemon twist or cherry","New Orleans classic."),
 C("presbyterian","Whiskey","Presbyterian",1570,"Scotch (or bourbon)",["Scotch whisky","Ginger ale","Soda water"],"60ml Scotch\nTop equal parts ginger ale & soda","Build","Highball, ice","Lemon twist"),
 C("piscosour","Brandy & pisco","Pisco Sour",1593,"Pisco",["Pisco","Lime juice","Simple syrup","Egg white","Angostura bitters"],"60ml pisco\n30ml lime\n22.5ml simple\n1 egg white\n3 drops Angostura on the foam","Dry shake, then shake with ice","Coupe","Angostura drops on the foam"),
 C("whiskeysour","Whiskey","Whiskey Sour",1625,"Bourbon",["Bourbon","Lemon juice","Simple syrup","Egg white (optional)"],"60ml bourbon\n30ml lemon\n22.5ml simple\nEgg white (optional)","Dry shake, then shake with ice","Rocks glass over ice (or coupe)","Angostura drops, or cherry & orange flag"),
];

export const FOLDERS = {
  cantina: {name:"Cantina", cats:["Cocktails","Happy hour","Shots","0%","Softs","Beer","Wine","Food"]},
  cocina: {name:"Corrochio's", cats:["Clásicos","De la casa","Happy hour","Low & no","Micheladas","Cerveza","Vino","Softs","House info"]},
  extras: {name:"House", cats:["House classics","Off-menu","Brunch"]},
  classics: {name:"Top 50", cats:["Whiskey","Gin","Rum & cachaça","Agave","Brandy & pisco","Vodka","Aperitivo & wine"]},
};

/* ── House specs (Corrochio's) ─────────────────────────────────────────────── */

const PB_ORANGE = "50ml ORANGE prebatch (35 Ocho Blanco + 15 Cointreau)";
const PB_WHITE = "50ml WHITE prebatch (35 Pensador mezcal + 15 Cointreau)";
const MICHE_BASE = "50ml Clamato\n25ml lime juice\n4 dashes Maggi\n3 dashes Worcestershire\n5ml Yucateco habanero sauce (more if they want it extra spicy)\nStir · bottled beer of choice on the side";
const MICHE = {glass:"Half beer stein, half filled with ice",method:"Build",rim:"Full Tajín",garnish:"Wooden stirrer, no straw"};
export const SPEC = {
  margarita:{glass:"Coupette or rocks",method:"Shake",rim:"Half rock salt (classic) or half Tajín (spicy)",garnish:"",spec:PB_ORANGE+"\n25ml lime juice\n7ml gomme (classic) OR 7ml jalapeño syrup (spicy)"},
  mezcalmarg:{glass:"Coupette or rocks",method:"Shake",rim:"Full pink salt (classic) or full Tajín (spicy)",garnish:"",spec:PB_WHITE+"\n25ml lime juice\n7ml gomme (classic) OR 7ml jalapeño syrup (spicy)"},
  tommys:{glass:"Rocks",method:"Shake & double strain",rim:"None",garnish:"",spec:"50ml Ocho Blanco\n25ml lime juice\n15ml agave syrup"},
  smokeytommys:{glass:"Rocks",method:"Shake & double strain",rim:"Full smoked salt",garnish:"",spec:"40ml Pensador mezcal\n25ml lime juice\n15ml agave syrup"},
  mezcalita:{glass:"Rocks",method:"Shake",rim:"Full Tajín",garnish:"Hibiscus syrup painted around the inside of the glass",spec:PB_WHITE+"\n10ml lime juice\n10ml pineapple juice\n10ml jalapeño syrup"},
  palomita:{glass:"Rocks",method:"Shake",rim:"Full Tajín + sugar",garnish:"Dehydrated grapefruit slice",spec:"50ml prebatch (35 Ojo de Dios hibiscus mezcal + 15 King's Ginger)\n20ml lime juice\n15ml grapefruit juice\n10ml agave syrup"},
  coqueta:{glass:"Highball",method:"Build",rim:"None",garnish:"Cucumber twirl",spec:"70ml prebatch (30 Condesa Prickly Pear gin, 15 Burnt Faith elderflower, 15 Lillet Blanc, 5 Campari)\n15ml raspberry/cucumber/dill pickle cordial\nTop soda"},
  jaliscomule:{glass:"Highball",method:"Build",rim:"None",garnish:"Dehydrated lime",spec:"50ml Ocho Reposado\n20ml lime juice\nTop ginger beer"},
  espresso:{glass:"Coupette",method:"Dry shake, wet shake, double strain",rim:"None",garnish:"3 coffee beans",spec:"40ml Ocho Blanco OR 40ml Finlandia vodka\n20ml Kahlúa\n50ml café de olla"},
  palomafresca:{glass:"Highball",method:"Shake, top with Ting",rim:"Full pink salt",garnish:"Fresh grapefruit slice",spec:"40ml Lyre's Agave Blanco\n15ml Three Spirit Livener\n40ml grapefruit juice\n15ml lime juice\n10ml gomme\nTop Ting"},
  margcero:{glass:"Rocks",method:"Shake",rim:"Half pink salt (classic) or half Tajín (spicy)",garnish:"Dehydrated lime wheel",spec:"35ml Lyre's Agave Blanco\n25ml lime juice\n10ml agave syrup\n15ml pineapple juice\nSpicy: +10ml jalapeño syrup"},
  aperolcero:{glass:"Wine glass",method:"Build",rim:"None",garnish:"Fresh orange slice",spec:"50ml Lyre's Italian Spritz\nTop soda"},
  cantarito:{glass:"Mexican clay vaso",method:"Build",rim:"Full chamoy + Tajín",garnish:"Half wheels of grapefruit, orange & lime, fanned on cocktail sticks",spec:"20ml orange juice\n20ml grapefruit juice\n20ml lime juice\n5ml gomme\nPinch of salt\nTop Ting (~100ml)"},
  michelada:{...MICHE,spec:"Michelada Clásica:\n"+MICHE_BASE},
};
SPEC.ochomarg = SPEC.margarita; SPEC.ochotommys = SPEC.tommys;
MENU.forEach(i => { if(SPEC[i.id]) Object.assign(i,SPEC[i.id]); });
MENU.push({id:"prebatch",folder:"cantina",cat:"Cocktails",name:"Prebatch colours",price:"",spirit:"",ingredients:[],note:"ORANGE = 35 Ocho Blanco + 15 Cointreau (Margaritas). WHITE = 35 Pensador mezcal + 15 Cointreau (Mezcal Marg, Mezcalita).",spec:"",
  qa:[{q:"What's in the ORANGE prebatch?",a:"Ocho Blanco + Cointreau",w:["Pensador mezcal + Cointreau","Ocho Reposado + agave","Ojo de Dios mezcal + King's Ginger"]},
      {q:"What's in the WHITE prebatch?",a:"Pensador mezcal + Cointreau",w:["Ocho Blanco + Cointreau","Pensador mezcal + agave","Condesa gin + Lillet Blanc"]},
      {q:"Which prebatch goes in the Mezcalita?",a:"WHITE (mezcal + Cointreau)",w:["ORANGE (tequila + Cointreau)","Palomita prebatch","No prebatch"]}]});

/* ── Cocina menu ───────────────────────────────────────────────────────────── */

const K = (id,cat,name,price,spirit,ingredients,note,extra={}) =>
  ({id:"k-"+id,folder:"cocina",cat,name,price,spirit,ingredients,note,spec:"",...extra});
export const COCINA = [
 K("margarita","Clásicos","Margarita","£11","Tequila Ocho Plata",["Tequila Ocho Plata","Cointreau","Lime","Gomme"],"Spicy or classic.",SPEC.margarita),
 K("mezcalmarg","Clásicos","Mezcal Margarita","£12","Pensador Espadín Mezcal",["Pensador Espadín Mezcal","Agave","Lime"],"Spicy or classic.",SPEC.mezcalmarg),
 K("tommys","Clásicos","Tommy's Margarita","£11","Tequila Ocho Plata",["Tequila Ocho Plata","Agave","Lime"],"",SPEC.tommys),
 K("smokey","Clásicos","Smokey Tommy's","£12","Pensador Espadín Mezcal",["Pensador Espadín Mezcal","Agave","Lime","Smoked salt rim"],"",SPEC.smokeytommys),
 K("coqueta","De la casa","La Coqueta","£12","Condesa Prickly Pear Gin",["Condesa Prickly Pear Gin","Burnt Faith Elderflower","Vermouth","Raspberry & cucumber dill pickle cordial","Schweppes soda"],"Long, refreshing and flirty: one for hot days.",SPEC.coqueta),
 K("celso","De la casa","Celso Piña","£11","Tequila Ocho Plata + Pensador mezcal",["Tequila Ocho Plata","Pensador Espadín Mezcal","Cointreau","Horchata","Pineapple","Lime"],"A piña colada, but make it Mexican.",
   {glass:"Rocks",method:"Shake",rim:"Full toasted coconut & Tajín sugar",garnish:"",spec:"25ml prebatch (25 Ocho, 5 mezcal, 5 Cointreau)\n10ml lime juice\n15ml horchata syrup\n25ml pineapple juice"}),
 K("bellanova","De la casa","Bellanova Sour","£12","Pensador Espadín Mezcal",["Pensador Espadín Mezcal","Hibiscus","Jalapeño","Citrus","Agave","Egg white"],"Silky, smoky, slightly sweet. Vegan option available.",
   {glass:"Coupette",method:"Dry shake, wet shake, double strain",rim:"None",garnish:"Dried hibiscus flower",spec:"40ml mezcal prebatch (mezcal + smoked salt saline)\n25ml lime juice\n25ml mezcal sour syrup\n1 egg white"}),
 K("palomita","De la casa","Palomita","£12","Ojo de Dios hibiscus mezcal",["Ojo de Dios Hibiscus Mezcal","King's Ginger","Grapefruit sherbet","Peychaud's bitters"],"A moreish twist on the Paloma. Picafresa rim.",SPEC.palomita),
 K("vampirito","De la casa","Vampirito","£12","Tequila Ocho Plata",["Tequila Ocho Plata","Viuda de Sánchez Sangrita","Orange","Lime","Salt"],"Citrusy and saline, from the streets of Soyatlán.",
   {glass:"Highball",method:"Build",rim:"Full Tajín",garnish:"Fresh orange slice",spec:"50ml Ocho Blanco\n50ml prebatch (sangrita + saline)\n25ml orange juice\n25ml lime juice\nTop Ting"}),
 K("diabla","De la casa","Margarita a la Diabla","£11 / £12","Tequila Ocho Plata OR Pensador mezcal",["Tequila Ocho Plata OR Pensador Espadín Mezcal","Cointreau","Agave","Habanero","Charred tortilla salt"],"£11 with tequila, £12 with mezcal. \"Hottest Margarita in the World\" (as voted by the staff).",
   {glass:"Rocks",method:"Shake",rim:"Charred tortilla salt: HALF rim for tequila, FULL rim for mezcal",garnish:"Whole dried red chilli",spec:"40ml tequila blanco OR 40ml mezcal\n10ml Cointreau\n25ml lime juice\n10ml habanero syrup\n10ml agave syrup",
    qa:[{q:"Tequila or mezcal Diabla: how does the rim change?",a:"Half rim for tequila, full rim for mezcal",w:["Full rim for tequila, half for mezcal","Full rim for both","No rim on the mezcal version"]}]}),
 K("mezcalita","De la casa","Mezcalita","£12","Pensador Espadín Mezcal",["Pensador Espadín Mezcal","Pineapple","Lime","Jalapeño syrup","Hibiscus caramel"],"Sweet, smoky, spicy. A signature since day one.",SPEC.mezcalita),
 K("espresso","De la casa","Espresso Martini de Olla","£12","Tequila Ocho Plata",["Tequila Ocho Plata","Kahlúa","Homemade café de olla","Piloncillo"],"Say it \"de la oi-ya\".",SPEC.espresso),
 K("hh","Happy hour","Happy hour (Cocina)","£8.50","",[],"£8.50 Ocho Margaritas, classic or spicy. Wed–Sat 6–7pm and all day Sunday.",
   {qa:[{q:"When is happy hour at the Cocina?",a:"Wed–Sat 6–7pm, all day Sunday",w:["Every day before 8pm","Tue–Fri 5–7pm","Weekends only"]},{q:"How much is a happy-hour Ocho Margarita at the Cocina?",a:"£8.50",w:["£8","£9","£7.50"]}]}),
 K("corona","Cerveza","Corona","£6.5","",["Draught","Mexican lager","4.5%"],""),
 K("modelo","Cerveza","Modelo","£7","",["Draught","Mexican lager","4.5%"],""),
 K("deya","Cerveza","Deya Steady Rolling Man","£7.2","",["Draught","Hazy pale ale","5.2%"],"The only non-Mexican beer and the only pale ale.",{qa:[{q:"Which Cocina beer is a hazy pale ale?",a:"Deya Steady Rolling Man",w:["Modelo Negra","Barrilito","Pacifico"]}]}),
 K("dosequis","Cerveza","Dos Equis","£7","",["Bottle","Mexican lager","4.5%"],""),
 K("pacifico","Cerveza","Pacifico","£6.5","",["Bottle","Mexican lager","4.5%"],""),
 K("negra","Cerveza","Modelo Negra","£8","",["Bottle","Dark Mexican lager","5.4%"],""),
 K("victoria","Cerveza","Victoria","£7","",["Bottle","Mexican lager","4%"],""),
 K("barrilito","Cerveza","Barrilito","£5.7","",["Bottle","Mexican lager","3.6%"],"Spelt \"Barraltio\" on the menu."),
 K("coronacero","Cerveza","Corona Cero","£5","",["Bottle","Alcohol-free lager","0.0%"],"+£2.50 Clamato michelada, +£1 chelada."),
 K("caguama","Cerveza","Caguama","£23","",["Tecate Light","1.2L bottle","3.9%"],"Imported from Mexico."),
 K("m-clasica","Micheladas","Michelada Clásica","+£2","",["Clamato","Salsa negra","Lime","Tajín rim"],"Corrochio's OG house michelada. Allergens (removable): gluten, fish, molluscs.",{...MICHE,spec:MICHE_BASE}),
 K("m-chelada","Micheladas","Chelada","+£1","",["Fresh lime","Rock salt rim"],""),
 K("m-vallarta","Micheladas","Michelada Vallarta","+£4.50","",["Michelada Clásica","Crispy fried fish chicharrón","Oyster dressing","Fried leeks"],"Not available on Tuesdays. Allergens: gluten, fish, molluscs.",{...MICHE,garnish:"From the kitchen: crispy fried fish chicharrón with oyster dressing",spec:MICHE_BASE,qa:[{q:"Which day is the Michelada Vallarta not available?",a:"Tuesday",w:["Monday","Sunday","Wednesday"]}]}),
 K("m-dulce","Micheladas","Michelada Dulce Beat","+£4","",["Tamarind","Sangrita","Chamoy","Achiote","Coriander","Candied sesame rim"],"ALLERGEN: sesame. Comes with a tamarind straw.",{...MICHE,rim:"Full rim: dip in tamarind + chamoy, then candied sesame seeds",garnish:"Tamarind straw",spec:"70ml Sirenita premix\n25ml lime juice\n4 dashes Maggi\n3 dashes Worcestershire\n5ml Yucateco habanero sauce\nStir · bottled beer on the side",qa:[{q:"Which michelada carries a sesame allergen?",a:"Michelada Dulce Beat",w:["Michelada Vallarta","Michilanga","Micheviche"]}]}),
 K("m-michilanga","Micheladas","Michilanga","+£4.50","",["Michelada Clásica","Cecina al pastor","Pineapple skewer"],"Allergens: gluten, fish, molluscs, sulphites.",{...MICHE,garnish:"Dehydrated pineapple skewer and cecina al pastor",spec:MICHE_BASE+"\n5ml pineapple juice\n5 drops achiote oil"}),
 K("m-micheviche","Micheladas","Micheviche","+£6","",["Michelada Clásica","Duro (wheat crisp)","Prawn ceviche"],"Allergens: gluten, fish, molluscs.",{...MICHE,garnish:"From the kitchen: duro topped with prawn ceviche",spec:MICHE_BASE}),
 K("red","Vino","Oveja Roja (red)","£7 / £8.5 / £20","",["Sangiovese/Merlot","Italy"],"125ml / 175ml / 500ml carafe."),
 K("white","Vino","Xalisquillo (white)","£7 / £8.5 / £20","",["Picpoul","France"],"125ml / 175ml / 500ml carafe."),
 K("orange","Vino","Albana (orange)","£38 bottle","",["Albana","Italy"],"Bottle only."),
 K("prosecco","Vino","Serena Prosecco","£35 bottle","",["Brut","Italy"],"Bottle only."),
 K("celsocero","Low & no","Celso Piña Cero","£8","",["Pineapple","Lime","Horchata","Water"],"Alcohol-free piña colada, Mexican style.",{glass:"Rocks",method:"Shake",rim:"Full toasted coconut & Tajín",garnish:"Dehydrated lime wheel",spec:"25ml pineapple juice\n10ml lime juice\n15ml horchata\n30ml water"}),
 K("palomafresca","Low & no","Paloma Fresca","£8.50","Lyre's agave 0%",["Lyre's agave 0%","Three Spirit Livener","Schweppes Pink Grapefruit","Citrus"],"Contains caffeine.",{...SPEC.palomafresca,qa:[{q:"Which alcohol-free drink contains caffeine?",a:"Paloma Fresca",w:["Margarita Cero","Celso Piña Cero","Cantarito Cero"]}]}),
 K("margcero","Low & no","Margarita Cero","£8","Lyre's agave 0%",["Lyre's agave spirit 0%","Fresh lime","Fresh pineapple","Agave"],"",SPEC.margcero),
 K("aperolcero","Low & no","Aperol Spritz Cero","£7","Lyre's Italian Spritz",["Lyre's Italian Spritz 0%","Schweppes soda","Fresh orange"],"",SPEC.aperolcero),
 K("cantaritocero","Low & no","Cantarito Cero","£7","",["Fresh grapefruit","Orange","Lime","Grapefruit soda","Chamoy & Tajín rim"],"Served in a clay cup.",SPEC.cantarito),
 K("topochico","Softs","Topo Chico","£5.5","",["Sparkling mineral water"],"\"The Champagne of Monterrey.\""),
 K("aguas","Softs","Agua frescas","£4","",["Homemade flavoured water"],"Ask for today's flavours."),
 K("squirt","Softs","Squirt","£4.50","",["Mexican sparkling grapefruit soda"],""),
 K("cacto","Softs","Cacto","£5","",["Sparkling prickly pear soda"],""),
 K("jarritos","Softs","Jarritos","£4.50","",["Flavoured Mexican soda"],"Ask for flavours."),
 K("electrolit","Softs","Electrolit","£4.50","",["Electrolyte drink"],"Cures tomorrow's cruda (hangover)."),
 K("water","Softs","Mineral water","£4.5","",["Still or sparkling","750ml"],""),
 K("service","House info","Service charge","12.5%","",[],"A discretionary 12.5% is added to the bill. All tips go to staff.",{qa:[{q:"What service charge goes on the bill?",a:"Discretionary 12.5%",w:["Discretionary 10%","Mandatory 12.5%","None, tips only"]}]}),
];

/* ── Extras (brunch/house classics/off-menu) ───────────────────────────────── */

const X = (id,cat,name,spirit,ingredients,note,extra) =>
  ({id:"x-"+id,folder:"extras",cat,name,price:"",spirit,ingredients,note,spec:"",...extra});
export const EXTRAS = [
 X("solmexico","Brunch","El Sol de Mexico","Aperol",["Aperol","Acid blend or lime","Pineapple juice","Gomme","Tonic"],"",{glass:"Highball",method:"Build",rim:"None",garnish:"Dehydrated orange slice",spec:"40ml Aperol\n10ml acid blend / lime juice\n30ml pineapple juice\n5ml gomme\nTop tonic water"}),
 X("sirentia","Brunch","Sirentia","Mezcal",["Mezcal","Sirentia mix"],"",{glass:"Highball",method:"Build",rim:"None",garnish:"Dehydrated grapefruit slice",spec:"40ml mezcal\nTop Sirentia mix"}),
 X("cafehorchata","Brunch","Café de Horchata","",["Horchata syrup","Café de olla"],"",{glass:"Highball",method:"Shake",rim:"None",garnish:"Cinnamon powder on top",spec:"50ml horchata syrup\n100ml café de olla"}),
 X("cafeolla","Brunch","Café de Olla (batch)","",["Coffee","Café de olla bags","Orange peel","Piloncillo"],"Served in short clay glasses. Also the base of the Espresso Martini de la Olla.",{glass:"Short clay glasses",method:"Brew coffee & bags together 45 min, then remove bags",rim:"",garnish:"",spec:"3 pots of coffee\n2 café de olla bags (6 cloves, 2 cinnamon sticks, 2.5 star anise)\n1 tea bag of orange peel (wash the orange)\n1.5 blocks piloncillo (Mexican sugar)\nBrew 45 min, remove and discard the bags",qa:[{q:"How long does the café de olla brew with the bags?",a:"45 minutes",w:["15 minutes","30 minutes","2 hours"]}]}),
 X("oldfashioned","House classics","Old Fashioned (house)","Evan Williams bourbon",["Evan Williams","Angostura bitters","Orange bitters","Demerara syrup"],"",{glass:"Rocks",method:"Build",rim:"None",garnish:"Orange twist",spec:"50ml Evan Williams\n3 dashes Angostura + 3 dashes orange bitters\n10ml demerara syrup (or a sugar cube)"}),
 X("negroni","House classics","Negroni (house)","Beefeater gin",["Beefeater gin","Campari","Cocchi vermouth"],"",{glass:"Rocks",method:"Build",rim:"None",garnish:"Orange peel",spec:"25ml Beefeater\n25ml Campari\n25ml Cocchi vermouth"}),
 X("mojito","House classics","Mojito (house)","El Dorado 3 year rum",["El Dorado 3yr rum","Lime wedges","Mint","Lime juice","Gomme"],"",{glass:"Highball",method:"Build",rim:"None",garnish:"Mint sprig",spec:"50ml El Dorado 3yr\n2 lime wedges\n5 mint leaves\n20ml lime juice\n10ml gomme"}),
 X("paloma","Off-menu","Paloma (house)","Ocho Blanco",["Ocho Blanco","Grapefruit juice","Lime juice","Agave syrup","Ting"],"",{glass:"Highball",method:"Shake, top with Ting",rim:"Full pink salt",garnish:"Dehydrated grapefruit slice",spec:"50ml Ocho Blanco\n25ml grapefruit juice\n10ml lime juice\n10ml agave syrup\nTop Ting"}),
 X("cantarito","Off-menu","Cantarito","Ocho Blanco",["Ocho Blanco","Orange juice","Grapefruit juice","Lime juice","Gomme","Salt","Ting"],"The full-strength version of the Cantarito Cero.",{glass:"Mexican clay vaso",method:"Build",rim:"Full chamoy + Tajín",garnish:"Half wheels of grapefruit, orange & lime, fanned on cocktail sticks",spec:"50ml Ocho Blanco\n20ml orange juice\n20ml grapefruit juice\n20ml lime juice\n5ml gomme\nPinch of salt\nTop Ting (~60ml)"}),
 X("vampiritocero","Off-menu","Vampirito Cero","",["Sangrita prebatch","Orange juice","Lime juice","Ting"],"",{glass:"Highball",method:"Build",rim:"Full Tajín",garnish:"Fresh orange slice",spec:"50ml prebatch (sangrita + saline)\n25ml orange juice\n25ml lime juice\nTop Ting"}),
 X("batanga","Off-menu","Batanga","El Tequileño Blanco",["El Tequileño Blanco","Fresh lime","Sea salt","Mexican Coke"],"Theatre: cut and squeeze the lime in front of the guest, then stir with the same knife.",{glass:"Highball",method:"Build, stir with the knife you cut the lime with",rim:"Maldon rock salt (NOT pink salt)",garnish:"",spec:"50ml El Tequileño Blanco\nJuice of a lime, cut and squeezed in front of the guest\nPinch of sea salt\nTop Mexican Coke\nStir with the knife you cut the lime with",qa:[{q:"What do you stir a Batanga with?",a:"The knife you cut the lime with",w:["A bar spoon","A wooden stirrer","A cinnamon stick"]},{q:"Which salt goes on the Batanga rim?",a:"Maldon rock salt",w:["Pink salt","Smoked salt","Tajín"]}]}),
];

export const DATA_VERSION = 2;

/* ── Drink families ────────────────────────────────────────────────────────── */

export const FAMILIES = {cantina:[
 {id:"marg",name:"Margarita family",
  build:"50ml prebatch · 25ml lime · 7ml sweetener · shake · coupette or rocks",
  rules:["Tequila → ORANGE prebatch (Ocho Blanco + Cointreau) and a HALF rim","Mezcal → WHITE prebatch (Pensador + Cointreau) and a FULL rim","Classic → 7ml gomme + salt rim · Spicy → 7ml jalapeño syrup + Tajín rim"],
  members:[
   ["margarita","The base: ORANGE prebatch · half rock salt (classic) or half Tajín (spicy)."],
   ["ochomarg","Exactly the Margarita build, £8 before 8pm."],
   ["mezcalmarg","Swap to WHITE prebatch · FULL pink salt (classic) or full Tajín (spicy)."],
   ["mezcalita","WHITE prebatch but only 10ml lime, plus 10 pineapple + 10 jalapeño syrup · always rocks · full Tajín · hibiscus syrup painted inside the glass."],
   ["margcero","0%, no prebatch: 35 Lyre's Agave · 25 lime · 10 agave · 15 pineapple (+10 jalapeño if spicy) · rocks · half pink salt or half Tajín · dehydrated lime wheel."]]},
 {id:"tommy",name:"Tommy's family",
  build:"Spirit · 25ml lime · 15ml agave syrup · NO Cointreau · shake & double strain · rocks",
  rules:["Tequila version: 50ml, no rim","Mezcal version: only 40ml, full smoked salt rim"],
  members:[
   ["tommys","50ml Ocho Blanco · no rim."],
   ["ochotommys","Exactly the Tommy's build, £8 before 8pm."],
   ["smokeytommys","40ml Pensador mezcal (10ml less) · full smoked salt rim."]]},
 {id:"paloma",name:"Paloma family",
  build:"Grapefruit + lime, with a salt or Tajín rim",
  rules:["Palomita is the only short one: shaken, on the rocks, no top","The two 0% drinks are long and topped with Ting","Pink salt → Paloma Fresca · chamoy + Tajín in a clay cup → Cantarito Cero"],
  members:[
   ["palomita","50ml prebatch (35 Ojo de Dios hibiscus mezcal + 15 King's Ginger) · 20 lime · 15 grapefruit · 10 agave · shake · rocks · full Tajín + sugar rim · dehydrated grapefruit."],
   ["palomafresca","0%: 40 Lyre's Agave · 15 Three Spirit Livener · 40 grapefruit · 15 lime · 10 gomme · shake, top Ting · highball · full pink salt · fresh grapefruit slice."],
   ["cantarito","0%: 20 OJ · 20 grapefruit · 20 lime · 5 gomme · pinch of salt · build, top Ting · clay vaso · chamoy + Tajín rim · citrus half wheels fanned on sticks."]]},
 {id:"long",name:"Long & built",
  build:"Build in the glass, top with a mixer · no shaker, no rim",
  rules:["Ginger beer → Jalisco Mule (the only reposado)","Soda in a highball → La Coqueta (the only gin)","Soda in a wine glass → Aperol Spritz Cero (0%)"],
  members:[
   ["jaliscomule","50 Ocho Reposado · 20 lime · top ginger beer · highball · dehydrated lime."],
   ["coqueta","70ml gin prebatch (Condesa, elderflower, Lillet, Campari) · 15ml raspberry/cucumber/dill cordial · top soda · highball · cucumber twirl."],
   ["aperolcero","50 Lyre's Italian Spritz · top soda · wine glass · fresh orange slice."]]},
 {id:"coffee",name:"Coffee",
  build:"Dry shake, wet shake, double strain · coupette",
  rules:["Guest picks the base: Ocho Blanco or Finlandia vodka","Say it \"de la oi-ya\""],
  members:[
   ["espresso","40 Ocho Blanco OR Finlandia · 20 Kahlúa · 50 café de olla · 3 coffee beans."]]},
 {id:"shots",name:"Shots (caballitos), £7",
  build:"A spirit, usually with something on the side",
  rules:["Tequila shot → Verdita","Mezcal + chaser → Pico Back · mezcal + Montenegro, ice cold → M&M","No agave at all → Bebé Guinness"],
  members:[
   ["verdita","Ocho Blanco + verdita chaser."],
   ["picoback","Pensador mezcal + spicy jalapeño brine chaser."],
   ["mm","Pensador mezcal + Montenegro, served ice cold. A CDMX favourite."],
   ["bebeguinness","Licor 43 Horchata + Kahlúa."]]},
 {id:"miche",name:"Michelada upgrades",
  build:"Any bottled beer, beer served on the side",
  rules:["Clásica +£2: the full Clamato mix in a half stein with a Tajín rim","Chelada +£1: just lime and a salt rim"],
  members:[
   ["michelada","Clásica: 50 Clamato · 25 lime · 4 dashes Maggi · 3 Worcestershire · 5ml Yucateco · half stein half filled with ice · full Tajín · wooden stirrer, no straw."]]}
]};

export const FAM_OF = {};
for(const f in FAMILIES) FAMILIES[f].forEach(fam => fam.members.forEach(([id,diff]) => { FAM_OF[id]={fam,diff}; }));

/* ── Bar mode: RAIL & BUILD ────────────────────────────────────────────────── */

export const RAIL = {
 "Spirits & prebatches":{
  ochoBlanco:["Ocho Blanco tequila","ml"],ochoRepo:["Ocho Reposado","ml"],pensador:["Pensador mezcal","ml"],tequileno:["El Tequileño Blanco","ml"],
  pbOrange:["ORANGE prebatch (Ocho + Cointreau)","ml"],pbWhite:["WHITE prebatch (mezcal + Cointreau)","ml"],pbPalomita:["Palomita prebatch (Ojo de Dios + King's Ginger)","ml"],
  pbCoqueta:["Coqueta prebatch (gin, elderflower, Lillet, Campari)","ml"],pbCelso:["Celso prebatch (Ocho, mezcal, Cointreau)","ml"],pbBella:["Bellanova prebatch (mezcal + smoked saline)","ml"],
  pbSangrita:["Sangrita prebatch (sangrita + saline)","ml"],finlandia:["Finlandia vodka","ml"],evan:["Evan Williams bourbon","ml"],beefeater:["Beefeater gin","ml"],eldorado:["El Dorado 3yr rum","ml"],
  aperol:["Aperol","ml"],lyresAgave:["Lyre's Agave Blanco 0%","ml"],lyresSpritz:["Lyre's Italian Spritz 0%","ml"],livener:["Three Spirit Livener","ml"]},
 "Liqueurs & vermouth":{cointreau:["Cointreau","ml"],kahlua:["Kahlúa","ml"],campari:["Campari","ml"],cocchi:["Cocchi vermouth","ml"]},
 "Juices":{lime:["Lime juice","ml"],grapefruit:["Grapefruit juice","ml"],orange:["Orange juice","ml"],pineapple:["Pineapple juice","ml"],clamato:["Clamato","ml"],cafeOlla:["Café de olla","ml"],acid:["Acid blend","ml"],water:["Water","ml"]},
 "Syrups & cordials":{gomme:["Gomme","ml"],agave:["Agave syrup","ml"],jalapeno:["Jalapeño syrup","ml"],habanero:["Habanero syrup","ml"],horchata:["Horchata syrup","ml"],mezcalSour:["Mezcal sour syrup","ml"],
  cordial:["Raspberry/cucumber/dill cordial","ml"],demerara:["Demerara syrup","ml"],sirenita:["Sirenita premix","ml"]},
 "Tops & mixers":{ting:["Ting","top"],soda:["Soda","top"],gingerBeer:["Ginger beer","top"],tonic:["Tonic","top"],mexCoke:["Mexican Coke","top"],sirentiaMix:["Sirentia mix","top"],beer:["Bottled beer","side"]},
 "Bitters, sauces & extras":{angostura:["Angostura bitters","dash"],orangeBitters:["Orange bitters","dash"],maggi:["Maggi","dash"],worcestershire:["Worcestershire","dash"],yucateco:["Yucateco habanero sauce","ml"],
  achiote:["Achiote oil","drop"],eggWhite:["Egg white","count"],salt:["Salt","pinch"],mint:["Mint leaves","count"],limeWedges:["Lime wedges","count"],freshLime:["Whole lime, squeezed in front of the guest","whole"]},
};

export const ING = {};
for(const g in RAIL) for(const k in RAIL[g]) ING[k]={label:RAIL[g][k][0],unit:RAIL[g][k][1],group:g};
export const AMOUNTS = {ml:[5,7,10,15,20,25,30,35,40,45,50,60,70,100],dash:[1,2,3,4,5,6],drop:[1,2,3,4,5,6],count:[1,2,3,4,5,6,8]};
export const FIXED = {top:"Top",pinch:"Pinch",side:"On the side",whole:"1 lime"};
export const fmtAmt = (k,v) => {
  const u=ING[k].unit;
  if(FIXED[u]) return FIXED[u];
  if(u==="ml") return v+"ml";
  if(u==="dash") return v+(v===1?" dash":" dashes");
  if(u==="drop") return v+(v===1?" drop":" drops");
  return String(v);
};

export const GLASSES = ["Coupette","Rocks","Highball","Wine glass","Clay vaso","Half beer stein"];
export const METHODS = ["Build","Shake","Shake & double strain","Dry shake, wet shake, double strain","Stir"];
export const RIMS = ["No rim","Half rock salt","Half Tajín","Half pink salt","Full pink salt","Full Tajín","Full smoked salt","Full Tajín + sugar","Full chamoy + Tajín","Half charred tortilla salt","Full charred tortilla salt","Full toasted coconut & Tajín sugar","Maldon rock salt","Tamarind + chamoy + candied sesame"];
export const GARNISHES = ["None","Dehydrated lime wheel","Dehydrated grapefruit slice","Dehydrated orange slice","Fresh grapefruit slice","Fresh orange slice","Hibiscus syrup inside the glass","Cucumber twirl","3 coffee beans","Whole dried red chilli","Dried hibiscus flower","Citrus half wheels fanned on sticks","Wooden stirrer, no straw","Tamarind straw","Pineapple skewer & cecina al pastor","Fish chicharrón & oyster dressing (kitchen)","Duro with prawn ceviche (kitchen)","Mint sprig","Orange twist","Orange peel","Cinnamon powder"];

export const GLASS_ICON = {
 "Coupette":'<path d="M4 6h16c0 4.2-3.6 7-8 7s-8-2.8-8-7z"/><path d="M12 13v7M8.5 20.5h7"/>',
 "Rocks":'<path d="M5 7h14l-1.2 12.5H6.2z"/><path d="M5.6 12h12.8"/>',
 "Highball":'<path d="M7 3h10l-1 18.5H8z"/><path d="M7.4 9h9.2"/>',
 "Wine glass":'<path d="M7 3h10v4.5a5 5 0 0 1-10 0z"/><path d="M12 12.5V20M8.5 20.5h7"/>',
 "Clay vaso":'<path d="M6 5h12l-1.8 14.5H7.8z"/><path d="M6.5 9.5h11M7 13.5h10"/>',
 "Half beer stein":'<path d="M5 5h10v15H5z"/><path d="M15 8.5h2.5a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H15"/><path d="M5 11h10"/>',
};
export const VLABEL = {classic:"Classic",spicy:"Spicy",tequila:"Tequila",mezcal:"Mezcal",vodka:"Vodka","Clásica":"Clásica"};
export const normRim = r => !r||r==="No rim" ? "No rim" : /^(Half|Full) /.test(r) ? r : "Full "+r;

const B = (glass,method,rim,garnish,ings) => ({glass:[].concat(glass),method,rim,garnish,ings});
const MICHE_I = {clamato:50,lime:25,maggi:4,worcestershire:3,yucateco:5,beer:1};
export const BUILD = {
 margarita:{classic:B(["Coupette","Rocks"],"Shake","Half rock salt","None",{pbOrange:50,lime:25,gomme:7}),
            spicy:B(["Coupette","Rocks"],"Shake","Half Tajín","None",{pbOrange:50,lime:25,jalapeno:7})},
 mezcalmarg:{classic:B(["Coupette","Rocks"],"Shake","Full pink salt","None",{pbWhite:50,lime:25,gomme:7}),
             spicy:B(["Coupette","Rocks"],"Shake","Full Tajín","None",{pbWhite:50,lime:25,jalapeno:7})},
 tommys:{"":B("Rocks","Shake & double strain","No rim","None",{ochoBlanco:50,lime:25,agave:15})},
 smokeytommys:{"":B("Rocks","Shake & double strain","Full smoked salt","None",{pensador:40,lime:25,agave:15})},
 mezcalita:{"":B("Rocks","Shake","Full Tajín","Hibiscus syrup inside the glass",{pbWhite:50,lime:10,pineapple:10,jalapeno:10})},
 palomita:{"":B("Rocks","Shake","Full Tajín + sugar","Dehydrated grapefruit slice",{pbPalomita:50,lime:20,grapefruit:15,agave:10})},
 coqueta:{"":B("Highball","Build","No rim","Cucumber twirl",{pbCoqueta:70,cordial:15,soda:1})},
 jaliscomule:{"":B("Highball","Build","No rim","Dehydrated lime wheel",{ochoRepo:50,lime:20,gingerBeer:1})},
 espresso:{tequila:B("Coupette","Dry shake, wet shake, double strain","No rim","3 coffee beans",{ochoBlanco:40,kahlua:20,cafeOlla:50}),
           vodka:B("Coupette","Dry shake, wet shake, double strain","No rim","3 coffee beans",{finlandia:40,kahlua:20,cafeOlla:50})},
 palomafresca:{"":B("Highball","Shake","Full pink salt","Fresh grapefruit slice",{lyresAgave:40,livener:15,grapefruit:40,lime:15,gomme:10,ting:1})},
 margcero:{classic:B("Rocks","Shake","Half pink salt","Dehydrated lime wheel",{lyresAgave:35,lime:25,agave:10,pineapple:15}),
           spicy:B("Rocks","Shake","Half Tajín","Dehydrated lime wheel",{lyresAgave:35,lime:25,agave:10,pineapple:15,jalapeno:10})},
 aperolcero:{"":B("Wine glass","Build","No rim","Fresh orange slice",{lyresSpritz:50,soda:1})},
 cantarito:{"":B("Clay vaso","Build","Full chamoy + Tajín","Citrus half wheels fanned on sticks",{orange:20,grapefruit:20,lime:20,gomme:5,salt:1,ting:1})},
 michelada:{"Clásica":B("Half beer stein","Build","Full Tajín","Wooden stirrer, no straw",MICHE_I)},
 "k-celso":{"":B("Rocks","Shake","Full toasted coconut & Tajín sugar","None",{pbCelso:25,lime:10,horchata:15,pineapple:25})},
 "k-bellanova":{"":B("Coupette","Dry shake, wet shake, double strain","No rim","Dried hibiscus flower",{pbBella:40,lime:25,mezcalSour:25,eggWhite:1})},
 "k-vampirito":{"":B("Highball","Build","Full Tajín","Fresh orange slice",{ochoBlanco:50,pbSangrita:50,orange:25,lime:25,ting:1})},
 "k-diabla":{tequila:B("Rocks","Shake","Half charred tortilla salt","Whole dried red chilli",{ochoBlanco:40,cointreau:10,lime:25,habanero:10,agave:10}),
             mezcal:B("Rocks","Shake","Full charred tortilla salt","Whole dried red chilli",{pensador:40,cointreau:10,lime:25,habanero:10,agave:10})},
 "k-celsocero":{"":B("Rocks","Shake","Full toasted coconut & Tajín sugar","Dehydrated lime wheel",{pineapple:25,lime:10,horchata:15,water:30})},
 "k-m-dulce":{"":B("Half beer stein","Build","Tamarind + chamoy + candied sesame","Tamarind straw",{sirenita:70,lime:25,maggi:4,worcestershire:3,yucateco:5,beer:1})},
 "k-m-michilanga":{"":B("Half beer stein","Build","Full Tajín","Pineapple skewer & cecina al pastor",{...MICHE_I,pineapple:5,achiote:5})},
 "k-m-vallarta":{"":B("Half beer stein","Build","Full Tajín","Fish chicharrón & oyster dressing (kitchen)",MICHE_I)},
 "k-m-micheviche":{"":B("Half beer stein","Build","Full Tajín","Duro with prawn ceviche (kitchen)",MICHE_I)},
 "x-solmexico":{"":B("Highball","Build","No rim","Dehydrated orange slice",{aperol:40,acid:10,pineapple:30,gomme:5,tonic:1})},
 "x-sirentia":{"":B("Highball","Build","No rim","Dehydrated grapefruit slice",{pensador:40,sirentiaMix:1})},
 "x-cafehorchata":{"":B("Highball","Shake","No rim","Cinnamon powder",{horchata:50,cafeOlla:100})},
 "x-oldfashioned":{"":B("Rocks","Build","No rim","Orange twist",{evan:50,angostura:3,orangeBitters:3,demerara:10})},
 "x-negroni":{"":B("Rocks","Build","No rim","Orange peel",{beefeater:25,campari:25,cocchi:25})},
 "x-mojito":{"":B("Highball","Build","No rim","Mint sprig",{eldorado:50,limeWedges:2,mint:5,lime:20,gomme:10})},
 "x-paloma":{"":B("Highball","Shake","Full pink salt","Dehydrated grapefruit slice",{ochoBlanco:50,grapefruit:25,lime:10,agave:10,ting:1})},
 "x-cantarito":{"":B("Clay vaso","Build","Full chamoy + Tajín","Citrus half wheels fanned on sticks",{ochoBlanco:50,orange:20,grapefruit:20,lime:20,gomme:5,salt:1,ting:1})},
 "x-vampiritocero":{"":B("Highball","Build","Full Tajín","Fresh orange slice",{pbSangrita:50,orange:25,lime:25,ting:1})},
 "x-batanga":{"":B("Highball","Build","Maldon rock salt","None",{tequileno:50,freshLime:1,salt:1,mexCoke:1})},
};
Object.assign(BUILD,{ochomarg:BUILD.margarita,ochotommys:BUILD.tommys,
 "k-margarita":BUILD.margarita,"k-mezcalmarg":BUILD.mezcalmarg,"k-tommys":BUILD.tommys,"k-smokey":BUILD.smokeytommys,
 "k-coqueta":BUILD.coqueta,"k-palomita":BUILD.palomita,"k-mezcalita":BUILD.mezcalita,
 "k-espresso":{tequila:BUILD.espresso.tequila},"k-palomafresca":BUILD.palomafresca,
 "k-margcero":BUILD.margcero,"k-aperolcero":BUILD.aperolcero,"k-cantaritocero":BUILD.cantarito,"k-m-clasica":BUILD.michelada});

/* ── Seed data for Firestore menus ─────────────────────────────────────────── */

export const SEED_MENUS = [
  {id:"cantina-drinks", name:"Cantina", type:"drinks", venue:"cantina", order:0, audiences:["bar","runner"], optionalFor:["floor","kitchen"], categories:["Cocktails","Happy hour","Shots","0%","Softs","Beer","Wine"], published:true},
  {id:"cantina-food", name:"Cantina Food", type:"food", venue:"cantina", order:1, audiences:["floor","kitchen"], optionalFor:["bar","runner"], categories:["Food"], published:true},
  {id:"cocina", name:"Corrochio's", type:"drinks", venue:"cocina", order:2, audiences:["bar","runner"], optionalFor:[], categories:["Clásicos","De la casa","Happy hour","Low & no","Micheladas","Cerveza","Vino","Softs","House info"], published:true},
  {id:"house", name:"House", type:"drinks", venue:"extras", order:3, audiences:["bar","runner"], optionalFor:[], categories:["House classics","Off-menu","Brunch"], published:true},
  {id:"classics", name:"Top 50", type:"drinks", venue:null, order:4, audiences:["bar","runner"], optionalFor:[], categories:["Whiskey","Gin","Rum & cachaça","Agave","Brandy & pisco","Vodka","Aperitivo & wine"], published:true},
];

export function builtinItemsForMenu(menuId) {
  const allItems = [...MENU, ...COCINA, ...EXTRAS, ...CLASSICS];
  const menuMeta = SEED_MENUS.find(m => m.id === menuId);
  if(!menuMeta) return [];
  const folderMap = {
    "cantina-drinks": i => i.folder === "cantina" && i.cat !== "Food",
    "cantina-food": i => i.folder === "cantina" && i.cat === "Food",
    "cocina": i => i.folder === "cocina",
    "house": i => i.folder === "extras",
    "classics": i => i.folder === "classics",
  };
  const filter = folderMap[menuId];
  if(!filter) return [];
  return allItems.filter(filter).map(item => ({
    ...item,
    build: BUILD[item.id] || null,
    menuId,
  }));
}

/* ── buildToSpec: generate text fields from a build object ─────────────────── */

export function buildToSpec(build, railObj) {
  if(!build || typeof build !== "object") return {};
  const variants = Object.keys(build);
  if(!variants.length) return {};

  if(variants.length === 1) {
    const v = build[variants[0]];
    return _variantToSpec(v, railObj);
  }
  // Multi-variant: generate combined spec showing variants
  const first = build[variants[0]];
  const spec = variants.map(vk => {
    const v = build[vk];
    const lines = Object.entries(v.ings).map(([k,val]) => {
      const ing = railObj[k] || {label:k, unit:"ml"};
      const unit = ing.unit;
      const label = ing.label;
      if(unit === "ml") return `${val}ml ${label}`;
      if(unit === "dash") return `${val} ${val===1?"dash":"dashes"} ${label}`;
      if(unit === "top") return `Top ${label}`;
      if(unit === "pinch") return `Pinch ${label}`;
      if(unit === "side") return `${label} on the side`;
      return `${label}`;
    }).join("\n");
    return `${vk ? vk.charAt(0).toUpperCase()+vk.slice(1)+": " : ""}${lines}`;
  }).join("\n---\n");
  return {
    spec,
    glass: first.glass.join(" or "),
    method: first.method,
    rim: variants.map(vk => `${vk||""}${vk?" → ":""}${normRim(build[vk].rim)}`).join(", "),
    garnish: first.garnish === "None" ? "" : first.garnish,
  };
}

function _variantToSpec(v, railObj) {
  if(!v) return {};
  const lines = Object.entries(v.ings).map(([k,val]) => {
    const r = railObj[k];
    if(!r) return String(val);
    const {label, unit} = r;
    if(unit === "ml") return `${val}ml ${label}`;
    if(unit === "dash") return `${val} ${val===1?"dash":"dashes"} ${label}`;
    if(unit === "top") return `Top ${label}`;
    if(unit === "pinch") return `Pinch ${label}`;
    if(unit === "side") return `${label} on the side`;
    if(unit === "count") return `${val} ${label}`;
    return `${label}`;
  });
  return {
    spec: lines.join("\n"),
    glass: v.glass.join(" or "),
    method: v.method,
    rim: normRim(v.rim),
    garnish: v.garnish === "None" ? "" : v.garnish,
  };
}

/* ── ICON SVGs ─────────────────────────────────────────────────────────────── */

export const ICON = {
  edit:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13 7l4 4"/></svg>',
  check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  cross:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  search:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',
  eye:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>',
  alert:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7.5v5.5M12 16.5v.1"/></svg>',
  back:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>',
  arrow:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  retry:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 4v6h6"/><path d="M5.6 15a8 8 0 1 0 1.9-8.3L4 10"/></svg>',
  ticket:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 3h14v18l-2.5-1.5L14 21l-2-1.5L10 21l-2.5-1.5L5 21z"/><path d="M8.5 8h7M8.5 12h7"/></svg>',
  minus:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/></svg>',
  trash:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg>',
  bulb:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/></svg>',
  sun:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
  plus:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  person:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>',
  shield:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2l8 4v5c0 5-3.5 9.7-8 11-4.5-1.3-8-6-8-11V6z"/></svg>',
  chart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>',
  menu:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h10"/></svg>',
  seed:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22V12M12 12C12 7 7 4 3 6c0 4 3 8 9 6M12 12c0-5 5-8 9-6 0 4-3 8-9 6"/></svg>',
};

export const DEFAULT_ITEMS = () => JSON.parse(JSON.stringify([...MENU, ...COCINA, ...EXTRAS, ...CLASSICS]));
