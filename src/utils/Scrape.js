import JSSoup from 'jssoup'; 

export const jsCode = "setTimeout(function(){ window.location.href = document.getElementsByTagName('iframe')[0].src; }, 5); setTimeout(() => { window.ReactNativeWebView.postMessage( document.documentElement.innerHTML ); }, 1000);";
        
export const scrapeView = (html) => {
    const soup = new JSSoup(html);
    
    if (soup.find('video') != null) {
        const link = soup.find('video')['attrs']['src'];
        if (link !== undefined && link.includes('m3u8')) {
            return link;
        }
    }
    return '';
}

export const getAllMoviesLink = async (title, year, episode = 0, season = 0) => {
    try {
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

        if (episode > 0 && link !== "#") {
            link = link.substring(0, link.length - 1);
            link = link + '-' + season + 'x' + episode + '/';
            link = link.replace('/series/', '/episode/');
        }

        return link === '#' ? await getVHLink(title, year, episode, season) : link;
    } catch (error) {
        return await getVHLink(title, year, episode, season);
    }
}

export const getVHLink = async (title, year, episode = 0, season = 0) => {
    const response = await fetch("https://vhmovies.com/search?keyword=" + title);
    const html = await response.text();
    const soup = new JSSoup(html);
    const aTags = soup.findAll('a', {'class': 'halim-thumb'});
    console.log(aTags);
    var finalATag;
    console.log(aTags.filter(x => 
        (episode === 0 ||
        (x['attrs']['title'] !== undefined && x['attrs']['title'].includes('Season ' + season.toString()))
        )
    ));
    aTags.filter(x => 
        (episode === 0 ||
        (x['attrs']['title'] !== undefined && x['attrs']['title'].includes('Season ' + season.toString()))
        )
    )
    .forEach(aTag => {
        if (
            finalATag === undefined &&
            aTag['descendants'].filter(x => x['name'] == 'p').filter(x => (episode > 0 || x['nextElement']['_text'] == year.toString())).length > 0
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

    console.log(link);

    return 'https://vhmovies.com' + link + 'watching.html?ep=' + episode.toString();
}