const { convertFromDirectory } = require('joi-to-typescript');

async function types(): Promise<void>{
    console.log("Running joi-to-typescript");
    const result = await convertFromDirectory({
        schemaDirectory: "./src/validation",
        typeOutputDirectory: "./src/interfaces",
        debug: true
    })

    if(result){
        console.log("Complete joi-to-typescript");
    } else {
        console.log("Error in joi-to-typescript");
    }
}
types();