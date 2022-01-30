// const puppetteer = require('puppeteer');

// getTitle = async (title) => {
//     const browser = await puppetteer.launch({
//         headless: true,
//     });
    
//     const page = await browser.newPage();
    
//     await page.setRequstInterception(true);
    
//     await page.goto('https://vhmovies.com/search/?keyword=' + title)
// }


// import jsdom from 'jsdom';
// const { JSDOM } = jsdom;

import JSSoup from 'jssoup'; 

getTitle = async () => {
    const response = await fetch('https://hdmoviesb.com/video/the-ice-age-adventures-of-buck-wild-hd-720-347181')
    const html = await response.text()
    var soup = new JSSoup(html);
    console.log(html)
    var iframe = soup.find('iframe')['attrs']['src'];
    console.log(iframe)
    // nightmare.goto('https://hdmoviesb.com/' + iframe)

    // const subresponse = await fetch('https://hdmoviesb.com/' + iframe)
    // const subhtml = await subresponse.text()
    // var subsoup = new JSSoup(subhtml);
    // console.log(subhtml)
    // var subiframe = subsoup.find('iframe');
    // console.log(subiframe)
    // console.log(dom.window.document.querySelector('a').href)
}

// getTitle()

// getTitle('The Godfather');
export default getTitle