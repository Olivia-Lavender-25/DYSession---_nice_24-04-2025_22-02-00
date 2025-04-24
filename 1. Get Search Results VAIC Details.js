let searchTerm = ``, offset = 0

let allSearchResultsVDObj = []

let PromiseR1

async function getSearchResults() {
    let VDItems = await fetch("https://www.douyin.com/aweme/v1/web/general/search/single/?device_platform=webapp&aid=6383&channel=channel_pc_web&search_channel=aweme_general&enable_history=1&keyword=" + decodeURIComponent(searchTerm) + "&search_source=normal_search&query_correct_type=1&is_filter_search=0&from_group_id=&offset=" + offset + "&count=10&need_filter_settings=0&list_type=single&search_id=20250424120349708EAB31D8EFA358D76F&update_version_code=170400&pc_client_type=1&pc_libra_divert=Mac&support_h265=1&support_dash=0&version_code=190600&version_name=19.6.0&cookie_enabled=true&screen_width=1680&screen_height=1050&browser_language=en-GB&browser_platform=MacIntel&browser_name=Chrome&browser_version=135.0.0.0&browser_online=true&engine_name=Blink&engine_version=135.0.0.0&os_name=Mac+OS&os_version=10.15.7&cpu_core_num=4&device_memory=8&platform=PC&downlink=10&effective_type=4g&round_trip_time=50&webid=7496725431619044905&", {
  "headers": {
    "accept": "application/json, text/plain, */*",
    "accept-language": "en-GB,en;q=0.9",
    "cache-control": "no-cache",
    "pragma": "no-cache",
    "priority": "u=1, i",
    "sec-ch-ua": "\"Google Chrome\";v=\"135\", \"Not-A.Brand\";v=\"8\", \"Chromium\";v=\"135\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"macOS\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "uifid": "undefined"
  },
  "referrer": "https://www.douyin.com/search/%E5%A5%B3%E6%98%8E%E6%98%9F00%E5%90%8E%E9%9D%A2%E9%83%A8%E5%88%86%E6%9E%90",
  "referrerPolicy": "strict-origin-when-cross-origin",
  "body": null,
  "method": "GET",
  "mode": "cors",
  "credentials": "include"
}).then(async(res) => {
    let t = await res.text()
    let j = JSON.parse(t).data.map(a => {
        return a.aweme_info
    })
    return j
    
})


console.log(offset, VDItems.length, VDItems.map(a=> a.aweme_id))
allSearchResultsVDObj.push(VDItems)
    if(VDItems.length > 0) {
        offset += 10
        getSearchResults()
    }
    else{
        R()
    }
}

getSearchResults()

await new Promise(r => {
    R = r
})

let AllSearchResultsVDObj = allSearchResultsVDObj.flat().reduce((acc, vdObj) => {
    let cond = !acc.find(a => a.aweme_id == vdObj.aweme_id)
    if(cond){
        acc.push(vdObj)
    }
    return acc
}, [])

AllSearchResultsVDObj