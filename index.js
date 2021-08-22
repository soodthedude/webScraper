const puppeteer = require("puppeteer");
const cheerio = require("cheerio");

//https://www.airbnb.co.in/s/Mumbai--Maharashtra/homes?refinement_paths%5B%5D=%2Fhomes&click_referer=t%3ASEE_ALL%7Csid%3A9ea0a18e-f8e0-4eec-8840-b5a4290dfd22%7Cst%3ASTOREFRONT_DESTINATION_GROUPINGS&tab_id=home_tab&flexible_trip_dates%5B%5D=august&flexible_trip_dates%5B%5D=september&flexible_trip_lengths%5B%5D=weekend_trip&date_picker_type=flexible_dates&source=structured_search_input_header&search_type=autocomplete_click&place_id=ChIJwe1EZjDG5zsRaYxkjY_tpF0&federated_search_session_id=7317ec4a-f62f-4649-9d15-754e610b99ee&pagination_search=true&items_offset=20&section_offset=3

//$( "._mm360j" )
let browser;
async function scrapeHomesInIndexPage(url){
    try{
        const page = await browser.newPage();
        await page.goto(url);
        const html = await page.evaluate(() =>document.body.innerHTML);
        const $ = await cheerio.load(html);

        const homes = $("[itemprop='url']")
        .map((i,element)=> "https://" + $(element).attr("content"))
        .get();
        //console.log(homes);
    }catch(err){
        console.error(err);
    }
    
}

async function scrapeDescriptionPage(url, page){
    try{
        await page.goto(url);
    }
    catch (err){
        console.error(err);
    }
}

async function main(){
    browser = await puppeteer.launch({ headless: false });
    const descriptionPage = await browser.newPage();
    const homes = await scrapeHomesInIndexPage(
        "https://www.airbnb.co.in/s/Mumbai--Maharashtra/homes?refinement_paths%5B%5D=%2Fhomes&click_referer=t%3ASEE_ALL%7Csid%3A9ea0a18e-f8e0-4eec-8840-b5a4290dfd22%7Cst%3ASTOREFRONT_DESTINATION_GROUPINGS&tab_id=home_tab&flexible_trip_dates%5B%5D=august&flexible_trip_dates%5B%5D=september&flexible_trip_lengths%5B%5D=weekend_trip&date_picker_type=flexible_dates&source=structured_search_input_header&search_type=autocomplete_click&place_id=ChIJwe1EZjDG5zsRaYxkjY_tpF0&federated_search_session_id=7317ec4a-f62f-4649-9d15-754e610b99ee&pagination_search=true&items_offset=20&section_offset=1"
    );
    
    for(var i=0; i<homes.length; i++){
        await scrapeDescriptionPage(homes[i], descriptionPage);
    }
    
}

main();

