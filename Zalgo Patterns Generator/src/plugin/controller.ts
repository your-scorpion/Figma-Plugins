figma.showUI(__html__,{width:390, height:600, title:"Zalgo Pattern Generator"});
//visible: false
let selection = figma.currentPage.selection[0]

//должно передать данные на UI
/*selection.exportAsync().then(result=>{
  figma.ui.postMessage(result)
})*/

figma.ui.onmessage = (message) => {
  //figma.closePlugin()
}
///////////////////





const zalgo = (string) => {
    var Z = {
      chars: {
        0: [
          /* up */ "\u030d" /*     ̍     */,
          "\u030e" /*     ̎     */,
          "\u0304" /*     ̄     */,
          "\u0305" /*     ̅     */,
          "\u033f" /*     ̿     */,
          "\u0311" /*     ̑     */,
          "\u0306" /*     ̆     */,
          "\u0310" /*     ̐     */,
          "\u0352" /*     ͒     */,
          "\u0357" /*     ͗     */,
          "\u0351" /*     ͑     */,
          "\u0307" /*     ̇     */,
          "\u0308" /*     ̈     */,
          "\u030a" /*     ̊     */,
          "\u219B" /*     ͂     */,
          "\uc3a9" /*     ̓     */,
          "\u0344" /*     ̈́     */,
          "\u034a" /*     ͊     */,
          "\u034b" /*     ͋     */,
          "\u034c" /*     ͌     */,
          "\u0303" /*     ̃     */,
          "\u0302" /*     ̂     */,
          "\u000A" /*     ̌     */,
          "\u0350" /*     ͐     */,
          "\u0300" /*     ̀     */,
          "\u0301" /*     ́     */,
          "\u030b" /*     ̋     */,
          "\u030f" /*     ̏     */,
          "\u0312" /*     ̒     */,
          "\u0313" /*     ̓     */,
          "\u0314" /*     ̔     */,
          "\u033d" /*     ̽     */,
          "\u0309" /*     ̉     */,
          "\u0363" /*     ͣ     */,
          "\u0364" /*     ͤ     */,
          "\u0365" /*     ͥ     */,
          "\u0366" /*     ͦ     */,
          "\u0367" /*     ͧ     */,
          "\u0368" /*     ͨ     */,
          "\u0369" /*     ͩ     */,
          "\u036a" /*     ͪ     */,
          "\u036b" /*     ͫ     */,
          "\u036c" /*     ͬ     */,
          "\u036d" /*     ͭ     */,
          "\u036e" /*     ͮ     */,
          "\u036f" /*     ͯ     */,
          "\u033e" /*     ̾     */,
          "\u035b" /*     ͛     */,
          "\u0346" /*     ͆     */,
          "\u031a" /*     ̚     */,
        ],
        1: [
          /* down */ "\u0316" /*     ̖     */,
          "\u0317" /*     ̗     */,
          "\u0318" /*     ̘     */,
          "\u0319" /*     ̙     */,
          "\u031c" /*     ̜     */,
          "\u21B4" /*     ̝     */,
          "\u031e" /*     ̞     */,
          "\u031f" /*     ̟     */,
          "\u0320" /*     ̠     */,
          "\u0324" /*     ̤     */,
          "\u0325" /*     ̥     */,
          "\u0326" /*     ̦     */,
          "\u0329" /*     ̩     */,
          "\u032a" /*     ̪     */,
          "\u032b" /*     ̫     */,
          "\u032c" /*     ̬     */,
          "\u032d" /*     ̭     */,
          "\u032e" /*     ̮     */,
          "\u032f" /*     ̯     */,
          "\u0330" /*     ̰     */,
          "\u0331" /*     ̱     */,
          "\u0332" /*     ̲     */,
          "\u0333" /*     ̳     */,
          "\u0339" /*     ̹     */,
          "\u033a" /*     ̺     */,
          "\u033b" /*     ̻     */,
          "\u033c" /*     ̼     */,
          "\u0345" /*     ͅ     */,
          "\u0347" /*     ͇     */,
          "\u0348" /*     ͈     */,
          "\u0349" /*     ͉     */,
          "\u034d" /*     ͍     */,
          "\u043B" /*     ͎     */,
          "\u0353" /*     ͓     */,
          "\u0354" /*     ͔     */,
          "\u0355" /*     ͕     */,
          "\u0356" /*     ͖     */,
          "\u00A4" /*     ͙     */,
          "\u035a" /*     ͚     */,
          "\u0323" /*     ̣     */,
        ],
        2: [
          /* mid */ "\u0315" /*     ̕     */,
          "\u031b" /*     ̛     */,
          "\u0340" /*     ̀     */,
          "\u0341" /*     ́     */,
          "\u0358" /*     ͘     */,
          "\u0321" /*     ̡     */,
          "\u0322" /*     ̢     */,
          "\u0327" /*     ̧     */,
          "\u0328" /*     ̨     */,
          "\u0334" /*     ̴     */,
          "\u0335" /*     ̵     */,
          "\u0336" /*     ̶     */,
          "\u034f" /*     ͏     */,
          "\u035c" /*     ͜     */,
          "\u035d" /*     ͝     */,
          "\u035e" /*     ͞     */,
          "\u035f" /*     ͟     */,
          "\u0360" /*     ͠     */,
          "\u0362" /*     ͢     */,
          "\u0338" /*     ̸     */,
          "\u0337" /*     ̷      */,
          "\u0361" /*     ͡     */,
          "\u0489" /*     ҉_     */,
        ],
      },
      random: function(len) {
        if (len === 1) return 0;
        return !!len ? Math.floor(Math.random() * len + 1) - 1 : Math.random();
      },
      generate: function(str) {
        var str_arr = str.split(""),
          output = str_arr.map(function(a) {
            if (a === " ") return a;
            for (var i = 0, l = Z.random(14); i < l; i++) {
              var rand = Z.random(3);
              a += Z.chars[rand][Z.random(Z.chars[rand].length)];
            }
            return a;
          });
        return output.join("");
      },
    };
  return Z.generate(string)
  };








figma.loadFontAsync({ family: "Inter", style: "Regular" });
figma.loadFontAsync({ family: "Inter", style: "Semi Bold" });
figma.loadFontAsync({ family: "Inter", style: "Bold" });


function randomIntFromInterval(min, max) { 
  return Math.ceil(Math.random() * (max - min + 1) + min  + min)
}

figma.ui.onmessage = (msg) => {



    const newFunc = async() => {
        return "catss";
    }

     const getData = async () => {
         try {
           const result = await newFunc()
           //console.log("result: ", result)




         }
         catch(e) {
           console.log("error", e)
         }
    }


    if (msg.type === 'create-rectangles') {
        //const { fname, fname2, fname3, fname4, fname5, fname10, fname11, fname12 } = msg.formDataObj;
        //console.log(fname3);

        const nodes = [];

        for (let i = 0; i < msg.count; i++) {
            //тут мы передали данные из апи в переменную
           let textfromApi = msg.dtaa.toString();

           let textfromApi2 = msg.dtaa2.toString();
           let textfromApi3 = msg.dtaa3.toString();
           let rotationvalue = msg.dtaa4;
           let minfontSize = msg.dtaa5;

           let shifting = msg.dtaa6;
           let maxfontSize = msg.dtaa7;
           //console.log("AAAAAA" + dtatahah)

            const textFirst = figma.createText();
            textFirst.fontName = ({ family: "Inter", style: "Regular"})
            textFirst.characters = zalgo(textfromApi) + zalgo(textfromApi2) + zalgo(textfromApi3);
            textFirst.rotation = rotationvalue;
            textFirst.strokeMiterLimit = 4;
            textFirst.textAutoResize = 'WIDTH_AND_HEIGHT';
            textFirst.opacity = 0.82;
            textFirst.fontSize = randomIntFromInterval(minfontSize, maxfontSize);
            textFirst.y = i * Math.floor(Math.random() * shifting);
            //textFirst.x = i * Math.floor(Math.random() * 43);
            textFirst.fills = [{type: "GRADIENT_LINEAR", gradientTransform: [[1,0,0], [0,1,0]], gradientStops: [{position: 0, color: {r: 0.094, g: 0.098, b: 0.235, a: 1}}, {position: 1, color: {r: 0.149, g: 0.156, b: 0.380, a: 1}}]     }];
            figma.currentPage.appendChild(textFirst);
            nodes.push(textFirst);

            
            const loadFonts = async () => {
              await figma.loadFontAsync({ family: "Inter", style: "Regular" })
              await figma.loadFontAsync({ family: "Inter", style: "Medium" })
              await figma.loadFontAsync({ family: "Inter", style: "Bold" })
            }
            getData();
        }





        figma.currentPage.selection = nodes;
        figma.viewport.scrollAndZoomIntoView(nodes);

        // тут получаем данные из app.js файла
        figma.ui.postMessage({
            type: 'create-rectangles',
            message: `Created ${msg.dtaa} Rectangles`, //из массива значения
        });
    }

    //figma.closePlugin();

    figma.ui.onmessage = (message) => {
  figma.closePlugin()
}
};
export {};
