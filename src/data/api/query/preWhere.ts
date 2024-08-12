import { Prisma } from '@prisma/client'

function aliasCols(cols: string[], prefix: string) {
    return cols.map(col => `${prefix}.${col} as ${prefix}_${col}`)
}

function memeAliasCols() {
    return aliasCols(
        Object.values(Prisma.MemeScalarFieldEnum), 
        'm'
    )
}

function templateAliasCols() {
    return aliasCols(
        Object.values(Prisma.TemplateScalarFieldEnum), 
        't'
    )
}

function userAliasCols() {
    return aliasCols(
        Object.values(Prisma.UserScalarFieldEnum), 
        'u'
    )
}

function imageAliasCols(prefix:'ui'|'mi') {
    return aliasCols(
        Object.values(Prisma.ImageScalarFieldEnum), 
        prefix
    )
}

export function preWhereMemeQuery() {
    const colGroups = [
        memeAliasCols(),
        templateAliasCols(),
        userAliasCols(),
        imageAliasCols('ui'),
        imageAliasCols('mi')
    ]
    const select = colGroups.map(
        colGroup => colGroup.join(', ')
    ).join(', ')

    return (
        `SELECT ${select} FROM "Meme" as m 
        JOIN "Template" as t ON m.template_id = t.id 
        JOIN "User" as u ON m.user_id = u.id 
        JOIN "Image" as mi ON m.product_image_id = mi.id 
        LEFT JOIN "Image" as ui ON u.profile_image_id = ui.id
        `
    )
}

export function preWhereUserQuery(profile_image=false) {
    const colGroups = [
        userAliasCols(),
    ]
    let profileImageJoin = ''

    if (profile_image) {
        colGroups.push(imageAliasCols('ui'))
        profileImageJoin = 'LEFT JOIN "Image" as ui ON u.profile_image_id = ui.id'
    }

    const select = colGroups.map(
        colGroup => colGroup.join(', ')
    ).join(', ')

    return (
        `SELECT ${select} FROM "User" as u 
        ${profileImageJoin}
        `
    )
}