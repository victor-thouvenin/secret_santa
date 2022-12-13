import {pick_rand, result_menu} from "./conf_one_pick.js"

let div = document.getElementById('1')
menu()

async function menu() {
    if (sessionStorage.getItem('tab_result') == null) {
    // if (localStorage.getItem('tab_result') == null) {
        let tab = await file_menu()
        tab = invert(tab)
        tab = sort_tab(tab)
        let tr = pick_rand(tab)
        if (tr == undefined) {
            return
        }
        sessionStorage.setItem('tab_result', JSON.stringify(tr))
        // localStorage.setItem('tab_result', JSON.stringify(tr))
    }
    let bname = "tirage"
    div.innerHTML = "<input type='button' value='" + bname + "'>"
    let input = div.querySelector('input')
    await wait_for_event(input, 'click')
    div.innerHTML = ""
    result_menu()
}

async function file_menu() {
    let bname = "liste des participants"
    div.innerHTML = "<input type='file' value='" + bname + "'>"
    let input = div.querySelector('input')
    await wait_for_event(input, 'change')
    return new Promise ((resolve) => {
        get_file()
        .then((res) => {
            readr(res)
            .then((res) => {
                let content = res.split(/\r\n|\n/)
                let tab = []
                for (let i = 0; i < content.length; i++) {
                    const tmp = content[i].split(/ *; */)
                    tab[tmp[0]] = []
                    if (tmp[1] != []) {
                        tab[tmp[0]] = tmp[1].split(/ *, */)
                    }
                }
                resolve(tab)
            })
            .catch(() => {})
        })
        .catch(() => {})
    })

    function get_file() {
        return new Promise ((resolve, reject) => {
            if (input.files.length == 0) {
                reject('&len')
            }
            resolve(input.files[0]) 
        })
    }

    function readr (file) {
        return new Promise ((resolve, reject) => {
            let freadr = new FileReader()
            freadr.onload = (ev) => {
                resolve(ev.target.result)
            }
            freadr.onerror = (e) => {
                alert(e.target.error.name)
                reject
            }
            freadr.readAsText(file)
        })
    }
}

function wait_for_event(it, event) {
    return new Promise((resolve) => {
        const lbd = () => {
            it.removeEventListener(event, lbd)
            resolve()
        }
        it.addEventListener(event, lbd)
    })
}

function invert(tab) {
    let k = Object.keys(tab)
    let v = Object.values(tab)
    for (let i = 0; i < k.length; i++) {
        let lst = k.concat(v[i], k[i])
        for (let j = 0; j < lst.length; j++) {
            let tmp = lst.filter(v => v == lst[j])
            if (tmp.length <= 1) {
                continue
            }
            for (const key in tmp) {
                lst.splice(lst.findIndex(v => v == tmp[key]), 1)
            }
        }
        tab[k[i]] = lst
    }
    return tab
}

function sort_tab(tab) {
    let lst = []
    let k = Object.keys(tab)
    let v = Object.values(tab)
    tab = []
    for (const i in k) {
        lst[i] = []
        lst[i][0] = k[i]
        lst[i][1] = v[i]
    }
    lst.sort((i, j) => {
        return i[1].length - j[1].length
    })
    for (const i in lst) {
        tab[lst[i][0]] = lst[i][1]
    }
    return tab
}