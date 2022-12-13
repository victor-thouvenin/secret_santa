export {pick_rand, result_menu}

function pick_rand(tab) {
    let tr = {}
    let ktab = Object.keys(tab)
    let vtab = Object.values(tab)
    let gi = 0
    while (ktab.length > 0) {
        let g = ktab[gi]
        var r
        var ri
        do {
            if (vtab[gi].length == 0) {
                alert("une erreur ses produite, veulliez réessayer.")
                return
            }
            let rnd = Math.floor(Math.random() * vtab[gi].length)
            r = vtab[gi][rnd]
            vtab[gi].splice(rnd, 1)
            ri = ktab.findIndex(v => v == r)
        } while (Object.values(tr).findIndex(v => v == r) != -1)
        tr[g] = r
        vtab[gi] = []
        if (Object.keys(tr).find(v => v == r)) {
            ktab.splice(ri, 1)
            vtab.splice(ri, 1)
            if (ri < gi) {
                gi--
            }
        }
        if (Object.values(tr).find(v => v == g)) {
            ktab.splice(gi, 1)
            vtab.splice(gi, 1)
            gi--
        }
        gi++
    }
    return (tr)
}

function result_menu() {
    let json_tab = sessionStorage.getItem('tab_result')
    // let json_tab = localStorage.getItem('tab_result')
    let tr = JSON.parse(json_tab)
    let name = prompt("entrez votre nom")
    while (tr[name] == undefined) {
        alert("ce nom n'a pas été trouvé, vérifiez l'orthographe puis réessayez.")
        name = prompt("entrez votre nom")
    }
    document.body.innerHTML = "vous avez piocher \"" + tr[name] + "\"."
}