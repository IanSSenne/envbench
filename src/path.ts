
export const join = (...args) => {
    const acc = []
    for (const arg of args) {
        for (const segment of arg.split(/[/\\]/)) {
            if (segment === "" || segment === ".") {
                continue
            } else if (segment === "..") {
                acc.pop()
            }
            else {
                acc.push(segment)
            }
        }
    }
    return acc.join("/")
}