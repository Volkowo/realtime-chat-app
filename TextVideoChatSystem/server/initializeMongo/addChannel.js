async function addChannels(collection){
    await collection.drop().catch(() => {});

    await collection.insertMany(
        [
            {
                "channelID": "c1",
                "channelName": "general",
                "groupID": "g1"
            },
            {
                "channelID": "c2",
                "channelName": "random",
                "groupID": "g1"
            },
            {
                "channelID": "cSep04_22204219",
                "channelName": "Ragebait",
                "groupID": "g1"
            },
            {
                "channelID": "c3",
                "channelName": "general",
                "groupID": "g2"
            },
            {
                "channelID": "c4",
                "channelName": "memes",
                "groupID": "g2"
            },
            {
                "channelID": "c5",
                "channelName": "projects",
                "groupID": "g3"
            },
            {
                "channelID": "c6",
                "channelName": "general",
                "groupID": "g4"
            },
            {
                "channelID": "c7",
                "channelName": "photos",
                "groupID": "g4"
            },
            {
                "channelID": "c8",
                "channelName": "math",
                "groupID": "g5"
            },
            {
                "channelID": "c9",
                "channelName": "physics",
                "groupID": "g5"
            },
            {
                "channelID": "cSep05_13224218",
                "channelName": "KenIsStinky",
                "groupID": "gSep05_1007132"
            },
            {
                "channelID": "cSep05_16264017",
                "channelName": "123",
                "groupID": "gSep05_1626400"
            },
            {
                "channelID": "cSep05_16302718",
                "channelName": "dsfg",
                "groupID": "gSep05_16302713"
            },
            {
                "channelID": "cSep05_18462811",
                "channelName": "dadadadadad",
                "groupID": "gSep05_1846285"
            },
            {
                "channelID": "cSep05_23570516",
                "channelName": "maimai",
                "groupID": "gSep05_2357059"
            },
            {
                "channelID": "cSep06_21101411",
                "channelName": "123",
                "groupID": "gSep06_21101417"
            },
            {
                "channelID": "cSep06_21131916",
                "channelName": "please",
                "groupID": "gSep06_2113193"
            },
            {
                "channelID": "cSep11_0909361",
                "channelName": "test",
                "groupID": "gSep11_09093619"
            },
            {
                "channelID": "cSep11_09100619",
                "channelName": "new channel",
                "groupID": "gSep11_09093619"
            },
            {
                "channelID": "cSep11_0910493",
                "channelName": "new",
                "groupID": "gSep11_0910496"
            }
        ]

    )
}

module.exports = {addChannels}