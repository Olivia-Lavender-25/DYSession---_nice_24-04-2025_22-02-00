
import fs from 'fs'
import axios from 'axios'


['Videos', 'Audios', 'Images', 'Covers'].map(dir => {
    try {
        fs.mkdirSync(dir)
    } catch (error) {

    }
})


let j = JSON.parse(fs.readFileSync('All DYSearchResults Videos Details.json').toString()).filter(a => !!a)
let totalDuration = j.reduce((acc, j) => {
    let duration = j.video.big_thumbs
    !!duration && (duration = duration[0]?.duration)
    if (duration) {
        return acc + duration
    } else {
        return acc
    }
}, 0)



let totalN = Math.ceil(j.length / 50)

let N = 0, inc = 50
let start = N * inc, end = (N + 1) * inc


let isLast = N == totalN - 1
let is2ndLast = N == totalN - 2

// end = j.length - start > 65 ? Math.min(end, j.length - 1) : Math.max(end, j.length - 1)
!!is2ndLast && j.length - end < 15 && (end = j.length || Math.max(end, j.length))
!!isLast && (end = j.length || Math.min(end, j.length))

let state = {
    downloadVAIC: true,
    json: false
}


// start = 0, end = j.length
// state.downloadVAIC = false
// state.json = true


console.log(j.length, j.length / inc, N + 1, end)
console.log(`totalDuration=${totalDuration}`)

console.log(`start=${start}, end=${end}`)

//----------


let allFnObjs = []

let J = j.slice(start, end).map((j, i) => {
    return (function (j, i) {
        return new Promise(function (r) {
            // console.log(Object.keys(j))
            // console.log(j.aweme_id)
            let { aweme_id, duration } = j
            !duration && (duration = j.video.duration)
            let videoURL = j?.video?.play_addr?.url_list[1]
            // console.log(aweme_id, videoURL)

            setTimeout(() => {
                let cond = j?.video?.play_addr?.url_list.length == 3
                let videoFilename
                if (cond) {
                    videoFilename = `Videos/` + aweme_id + '.mp4'

                    download_url_to_file(videoURL, videoFilename, i, 'Video', r)
                }

                let videoCoverURL = j.video?.cover?.url_list[0]
                let coverFilename = 'Covers/' + aweme_id + '.png'
                download_url_to_file(videoCoverURL, coverFilename, i, 'Cover')

                let musicURL = j.music?.play_url.uri
                // console.log(i, musicURL)
                let musicFilename = 'Audios/' + aweme_id + `.mp3`
                !!musicURL && download_url_to_file(musicURL, musicFilename, i, 'Audio')

                let images = j.images
                let imagesFilenames
                if (images) {
                    imagesFilenames = images.map((img, _i) => {
                        let imgURL = img.url_list[0]
                        if (!fs.existsSync('Images/' + aweme_id)) fs.mkdirSync('Images/' + aweme_id)
                        download_url_to_file(imgURL, 'Images/' + aweme_id + `/${_i}.png`, i, 'Image', r)
                        let imageFilename = 'Images/' + aweme_id + `/${_i}.png`

                        return imageFilename
                    })
                }

                let fnObj = { aweme_id, duration, videoFilename, musicFilename, imagesFilenames, coverFilename }
                // console.log(i + 1, fnObj)
                allFnObjs.push(fnObj)
                state.json && r()
            }, state.json ? 0 : 3000 * i);

        })

    })(j, i)
})


let allErrors = []

async function download_url_to_file(videoUrl, filePath, i, type, r) {
    if (!state.downloadVAIC) {
        !!r && r()
        return
    }
    try {
        // Send GET request to fetch the video
        const response = await axios.get(videoUrl, {
            responseType: 'stream',  // Ensures that the response is a stream
        });


        // Create a writable stream to the file
        const writer = fs.createWriteStream(filePath);

        // Pipe the response stream to the writable stream (save to file)
        response.data.pipe(writer);

        // Wait for the file to be fully written
        writer.on('finish', () => {
            console.log(i + 1, start + i + 1, end, `${type} downloaded successfully!`);
            typeof r == 'function' && r()
        });

        writer.on('error', (error) => {
            console.error('Error writing file:', error);
            typeof r == 'function' && r()
        });
    } catch (error) {
        console.error('Error downloading video:', i + 1, start + i + 1, type);
        let errObj = {
            i: start + i,
            type
        }
        allErrors.push(errObj)
        typeof r == 'function' && r()
    }
}

async function main() {
    if (state.downloadVAIC == false && state.json == true) return

    await Promise.all(J)
    console.log('All files downloaded!')
    console.log(allErrors)

}

main()

async function getFnJson() {
    state.downloadVAIC = false
    state.json = true

    console.log('a')

    await Promise.all(J)

    console.log('b')
    
    fs.writeFileSync('All V,A,I,C Objs.json', JSON.stringify(allFnObjs, null, 1))

    state.downloadVAIC = true
    state.json = false

}

// getFnJson()