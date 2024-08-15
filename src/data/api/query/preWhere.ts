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

function bookmarkAliasCols() {
    return aliasCols(
        Object.values(Prisma.BookmarkScalarFieldEnum),
        'b'
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

export function preWhereUserQuery(includeProfileImage=false) {
    const colGroups = [
        userAliasCols(),
    ]
    let profileImageJoin = ''

    if (includeProfileImage) {
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

// Includes the meme user, not the bookmark user
export function preWhereBookmarkQuery() {
    const colGroups = [
        bookmarkAliasCols(),
        memeAliasCols(),
        templateAliasCols(),
        imageAliasCols('mi'),
        userAliasCols(), 
        imageAliasCols('ui')
    ]

    const select = colGroups.map(
        colGroup => colGroup.join(', ')
    ).join(', ')

    return (
        `SELECT ${select} FROM "Bookmark" as b 
        JOIN "Meme" as m ON m.id = b.meme_id 
        JOIN "Image" as mi ON m.product_image_id = mi.id 
        JOIN "Template" as t ON m.template_id = t.id 
        JOIN "User" as u ON m.user_id = u.id 
        LEFT JOIN "Image" as ui ON u.profile_image_id = ui.id
        `
    )
}