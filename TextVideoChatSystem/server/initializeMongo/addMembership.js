async function addMembership(collection){
    await collection.drop().catch(() => {});

    await collection.insertMany(
        [
            { "membershipID": "m1", "userID": "1", "groupID": "g1", "role": "superAdmin" },
            { "membershipID": "m2", "userID": "1", "groupID": "g2", "role": "superAdmin" },
            { "membershipID": "m3", "userID": "1", "groupID": "g3", "role": "superAdmin" },
            { "membershipID": "m4", "userID": "1", "groupID": "g4", "role": "superAdmin" },
            { "membershipID": "m5", "userID": "1", "groupID": "g5", "role": "superAdmin" },
            { "membershipID": "m6", "userID": "1", "groupID": "gSep05_1007132", "role": "superAdmin" },
            { "membershipID": "m7", "userID": "1", "groupID": "gSep05_1626400", "role": "superAdmin" },
            { "membershipID": "m8", "userID": "1", "groupID": "gSep05_16302713", "role": "superAdmin" },
            { "membershipID": "m9", "userID": "1", "groupID": "gSep05_1846285", "role": "superAdmin" },
            { "membershipID": "m10", "userID": "1", "groupID": "gSep05_2357059", "role": "superAdmin" },
            { "membershipID": "m11", "userID": "1", "groupID": "gSep06_21101417", "role": "superAdmin" },
            { "membershipID": "m12", "userID": "1", "groupID": "gSep06_2113193", "role": "superAdmin" },
            { "membershipID": "m13", "userID": "1", "groupID": "gSep11_09093619", "role": "superAdmin" },
            { "membershipID": "m14", "userID": "1", "groupID": "gSep11_0910496", "role": "superAdmin" },

            { "membershipID": "m15", "userID": "2", "groupID": "g1", "role": "groupAdmin" },
            { "membershipID": "m16", "userID": "2", "groupID": "g2", "role": "groupAdmin" },
            { "membershipID": "m17", "userID": "2", "groupID": "gSep05_1007132", "role": "groupAdmin" },
            { "membershipID": "m18", "userID": "2", "groupID": "gSep06_21101417", "role": "groupAdmin" },
            { "membershipID": "m19", "userID": "2", "groupID": "gSep11_09093619", "role": "chatUser" },

            { "membershipID": "m20", "userID": "3", "groupID": "g3", "role": "groupAdmin" },
            { "membershipID": "m21", "userID": "3", "groupID": "g1", "role": "groupAdmin" },
            { "membershipID": "m22", "userID": "3", "groupID": "g2", "role": "chatUser" },
            { "membershipID": "m23", "userID": "3", "groupID": "g5", "role": "chatUser" },

            { "membershipID": "m24", "userID": "5", "groupID": "g3", "role": "groupAdmin" },
            { "membershipID": "m25", "userID": "5", "groupID": "g1", "role": "chatUser" },
            { "membershipID": "m26", "userID": "5", "groupID": "gSep05_16302713", "role": "chatUser" },
            { "membershipID": "m27", "userID": "5", "groupID": "g2", "role": "chatUser" },
            { "membershipID": "m28", "userID": "5", "groupID": "gSep11_09093619", "role": "chatUser" },

            { "membershipID": "m29", "userID": "6", "groupID": "g1", "role": "chatUser" },
            { "membershipID": "m30", "userID": "6", "groupID": "g2", "role": "chatUser" },
            { "membershipID": "m31", "userID": "6", "groupID": "gSep05_1626400", "role": "chatUser" },

            { "membershipID": "m32", "userID": "7", "groupID": "g1", "role": "superAdmin" },
            { "membershipID": "m33", "userID": "7", "groupID": "g2", "role": "superAdmin" },
            { "membershipID": "m34", "userID": "7", "groupID": "g3", "role": "superAdmin" },
            { "membershipID": "m35", "userID": "7", "groupID": "g4", "role": "superAdmin" },
            { "membershipID": "m36", "userID": "7", "groupID": "g5", "role": "superAdmin" },
            { "membershipID": "m37", "userID": "7", "groupID": "gSep05_1007132", "role": "superAdmin" },
            { "membershipID": "m38", "userID": "7", "groupID": "gSep05_1626400", "role": "superAdmin" },
            { "membershipID": "m39", "userID": "7", "groupID": "gSep05_16302713", "role": "superAdmin" },
            { "membershipID": "m40", "userID": "7", "groupID": "gSep05_1846285", "role": "superAdmin" },
            { "membershipID": "m41", "userID": "7", "groupID": "gSep05_2357059", "role": "superAdmin" },
            { "membershipID": "m42", "userID": "7", "groupID": "gSep06_21101417", "role": "superAdmin" },
            { "membershipID": "m43", "userID": "7", "groupID": "gSep06_2113193", "role": "superAdmin" },
            { "membershipID": "m44", "userID": "7", "groupID": "gSep11_09093619", "role": "superAdmin" },
            { "membershipID": "m45", "userID": "7", "groupID": "gSep11_0910496", "role": "superAdmin" },

            { "membershipID": "m46", "userID": "Sep06_1903296", "groupID": "g1", "role": "superAdmin" },
            { "membershipID": "m47", "userID": "Sep06_1903296", "groupID": "g2", "role": "superAdmin" },
            { "membershipID": "m48", "userID": "Sep06_1903296", "groupID": "g3", "role": "superAdmin" },
            { "membershipID": "m49", "userID": "Sep06_1903296", "groupID": "g4", "role": "superAdmin" },
            { "membershipID": "m50", "userID": "Sep06_1903296", "groupID": "g5", "role": "superAdmin" },
            { "membershipID": "m51", "userID": "Sep06_1903296", "groupID": "gSep05_1007132", "role": "superAdmin" },
            { "membershipID": "m52", "userID": "Sep06_1903296", "groupID": "gSep05_1626400", "role": "superAdmin" },
            { "membershipID": "m53", "userID": "Sep06_1903296", "groupID": "gSep05_16302713", "role": "superAdmin" },
            { "membershipID": "m54", "userID": "Sep06_1903296", "groupID": "gSep05_1846285", "role": "superAdmin" },
            { "membershipID": "m55", "userID": "Sep06_1903296", "groupID": "gSep05_2357059", "role": "superAdmin" },
            { "membershipID": "m56", "userID": "Sep06_1903296", "groupID": "gSep06_21101417", "role": "superAdmin" },
            { "membershipID": "m57", "userID": "Sep06_1903296", "groupID": "gSep06_2113193", "role": "superAdmin" },
            { "membershipID": "m58", "userID": "Sep06_1903296", "groupID": "gSep11_09093619", "role": "superAdmin" },
            { "membershipID": "m59", "userID": "Sep06_1903296", "groupID": "gSep11_0910496", "role": "superAdmin" }
        ]
    )
}

module.exports = {addMembership}