import JSSoup from 'jssoup'; 

export const jsCode = "setTimeout(function(){window.location.href = document.getElementsByTagName('iframe')[0].src;}, 5); setTimeout(() => { window.ReactNativeWebView.postMessage( document.documentElement.innerHTML ); }, 1000);";
        
export const scrapeView = (html) => {
    // console.log(html);
    const soup = new JSSoup(html);
        
    // console.log(soup.findAll('video'))
    // console.log(soup.findAll('iframe'))

    if (soup.find('video') != null) {
        const link = soup.find('video')['attrs']['src'];
        if (link.includes('m3u8')) {
            return link;
        }
    }
    return '';
}

export const getAllMoviesLink = async (title, year) => {
    const response = await fetch("https://allmoviesforyou.net/?s=" + title);
    const html = await response.text();
    const soup = new JSSoup(html);
    const aTags = soup.findAll('a');
    var finalATag;
    aTags.forEach(aTag => {
        if (
            finalATag === undefined &&
            aTag['descendants'].filter(x => x['name'] == 'span').filter(x => x['nextElement']['_text'] == year.toString()).length > 0
        ) {
            finalATag = aTag;
        }
    });

    var link;
    if (finalATag == null) {
        link = aTags[0]['attrs']['href'];
    } else {
        link = finalATag['attrs']['href'];
    }

    return link === '#' ? await getVHLink(title, year) : link;
}

export const getVHLink = async (title, year) => {
    const response = await fetch("https://vhmovies.com/search?keyword=" + title);
    const html = await response.text();
    const soup = new JSSoup(html);
    const aTags = soup.findAll('a', {'class': 'halim-thumb'});
    var finalATag;
    aTags.forEach(aTag => {
        if (
            finalATag === undefined &&
            aTag['descendants'].filter(x => x['name'] == 'p').filter(x => x['nextElement']['_text'] == year.toString()).length > 0
        ) {
            finalATag = aTag;
        }
    });
    var link;
    if (finalATag == null) {
        link = aTags[0]['attrs']['href'];
    } else {
        link = finalATag['attrs']['href'];
    }

    return 'https://vhmovies.com' + link + 'watching.html';
}