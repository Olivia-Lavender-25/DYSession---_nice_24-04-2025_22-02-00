import fs from 'fs'

let F = JSON.parse(fs.readFileSync('All V,A,I,C Objs.json').toString())

let GStr = ``
F.slice(0, 10).map(a => {
    let {videoFilename, musicFilename, coverFilename} = a
    ;[videoFilename, musicFilename, coverFilename].map(a => {
    })

})