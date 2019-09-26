export class EpisodeDataParser {

    constructor() { }

    /*
    parseTotalData(dataToBeParsed, seasonSelection, charactersInfo, dataVectorName, isPercentage) {
        var data = [];
        var numberOfEpisodes = 0;
        for (var i = 0; i < dataToBeParsed.length; i++) {
            if ((seasonSelection == 0) || (dataToBeParsed[i].season == seasonSelection)) {
                data = this.pushTotalCharacterData(data, i, dataToBeParsed, charactersInfo, dataVectorName);
                numberOfEpisodes++;
            }
        }

        var parsedData = [];
        data.forEach(function (item) {
            parsedData.push(item);
        });

        if (isPercentage) {
            for (var j = 0; j < parsedData.length; j++) {
                parsedData[j].value = parsedData[j].value / numberOfEpisodes;
            }
        }

        return parsedData;
    }

    pushTotalCharacterData(data, i, dataToBeParsed, charactersInfo, dataVectorName) {
        for (var j = 0; j < dataToBeParsed[dataVectorName].length; j++) {
            if (this.getcharactersInfo(charactersInfo,dataToBeParsed[dataVectorName][j].character, "isShowing") == true) {
                if (!data[j]) {
                    data[j] = {
                        label: dataToBeParsed[dataVectorName][j].label,
                        value: (dataToBeParsed[dataVectorName][j].value * 100) / dataToBeParsed.totalNumberOfScenes,
                        character: dataToBeParsed[dataVectorName][j].character,
                        color: this.getcharactersInfo(charactersInfo, dataToBeParsed[dataVectorName][j].character, "color"),
                        highlightColor: this.getcharactersInfo(charactersInfo, dataToBeParsed[dataVectorName][j].character, "hightlight")
                    }
                }
                else {
                    data[j].value += (dataToBeParsed[dataVectorName][j].value * 100) / dataToBeParsed.totalNumberOfScenes;
                }
            }

        }

        return data;
    }

    parseSeasonData(dataToBeParsed, charactersInfo, dataVectorName, isPercentage) {
        var data = [];
        var numberOfEpisodesPerSeason = [];
        for (var i = 0; i < dataToBeParsed.length; i++) {
            data = this.pushSeasonCharacterData(data, i, dataToBeParsed, charactersInfo, dataVectorName);
            if (!numberOfEpisodesPerSeason[dataToBeParsed.season - 1])
                numberOfEpisodesPerSeason[dataToBeParsed.season - 1] = 0;
            numberOfEpisodesPerSeason[dataToBeParsed.season - 1]++;
        }

        var parsedData = [];
        for (var j = 0; j < data.length; j++) {
            parsedData[j] = { name: data[j].name, characters: [] };
            parsedData[j].characters = [];
            data[j].characters.forEach(function (item) {
                parsedData[j]['info'].push(item);
            });
        }
        if (isPercentage) {
            for (var j = 0; j < parsedData.length; j++) {
                for (var k = 0; k < parsedData[j].characters.length; k++) {
                    parsedData[j].characters[k].value = parsedData[j].characters[k].value / numberOfEpisodesPerSeason[j];
                }
            }
        }

        return parsedData;
    }

    pushSeasonCharacterData(data, i, dataToBeParsed, charactersInfo, dataVectorName) {
        if (!data[dataToBeParsed.season - 1])
            data[dataToBeParsed.season - 1] = { name: "Season " + dataToBeParsed.season, characters: [] };

        for (var j = 0; j < dataToBeParsed[dataVectorName].length; j++) {
            if (this.getcharactersInfo(charactersInfo,dataToBeParsed[dataVectorName][j].character, "isShowing") == true) {
                if (!data[dataToBeParsed.season - 1].characters[j]) {
                    data[dataToBeParsed.season - 1].characters[j] = {
                        name: "Season " + dataToBeParsed.season,
                        season: dataToBeParsed.season,
                        label: dataToBeParsed[dataVectorName][j].label,
                        value: (dataToBeParsed[dataVectorName][j].value * 100) / dataToBeParsed.totalNumberOfScenes,
                        character: dataToBeParsed[dataVectorName][j].character,
                        color: this.getcharactersInfo(charactersInfo,dataToBeParsed[dataVectorName][j].character, "color"),
                        highlightColor: this.getcharactersInfo(charactersInfodataToBeParsed[dataVectorName][j].character, "hightlight")
                    }

                }
                else {
                    data[dataToBeParsed.season - 1].characters[j].value += (dataToBeParsed[dataVectorName][j].value * 100) / dataToBeParsed.totalNumberOfScenes;
                }
            }
        }
        return data;
    }

    parseEpisodicData(dataToBeParsed, seasonSelection, charactersInfo, dataVectorName, isPercentage) {
        var data = [];
        var numberOfEpisodes = 0;
        for (var i = 0; i < dataToBeParsed.length; i++) {
            if ((seasonSelection == 0) || (dataToBeParsed.season == seasonSelection)) {
                data = this.pushEpisodicCharacterData(data, i, numberOfEpisodes, dataToBeParsed, charactersInfo, dataVectorName);
                numberOfEpisodes++;
            }
        }

        var parsedData = [];
        for (var j = 0; j < data.length; j++) {
            parsedData[j] = { name: data[j].name, characters: [] };
            parsedData[j].characters = [];
            data[j].characters.forEach(function (item) {
                parsedData[j]['info'].push(item);
            });
        }

        return parsedData;
    }

    pushEpisodicCharacterData(data, i, id, dataToBeParsed, charactersInfo, dataVectorName) {
        data[id] = { name: dataToBeParsed.name, characters: [] };

        for (var j = 0; j < dataToBeParsed[dataVectorName].length; j++) {
            if (this.getcharactersInfo(charactersInfo,dataToBeParsed[dataVectorName][j].character, "isShowing") == true) {
                data[id].characters[j] = {
                    name: dataToBeParsed.name,
                    season: dataToBeParsed.season,
                    episode: dataToBeParsed.episode,
                    label: dataToBeParsed[dataVectorName][j].label,
                    value: Math.round((dataToBeParsed[dataVectorName][j].value * 100) / dataToBeParsed.totalNumberOfScenes),
                    character: dataToBeParsed[dataVectorName][j].character,
                    color: this.getcharactersInfo(charactersInfo,dataToBeParsed[dataVectorName][j].character, "color"),
                    highlightColor: this.getcharactersInfo(charactersInfo,dataToBeParsed[dataVectorName][j].character, "hightlight")
                }
            }

        }
        return data;
    }

    parseLineData() {

        var parsedData = [];
        for (var j = 0; j < this.parsedData.length; j++) {
            //parsedData[j] =  { name: data[j].name, characters: [] };
            //parsedData[j].characters = [];
            this.parsedData[j].characters.forEach(function (item, index) {
                if (!parsedData[index])
                    parsedData[index] = { character: item.character, color: item.color, highlightColor: item.highlightColor, episodes: [] };
                parsedData[index]['episodes'].push({
                    name: item.name,
                    season: item.season,
                    episode: item.episode,
                    value: Math.round(item.value),
                    character: item.character,
                    color: item.color,
                    highlightColor: item.highlightColor
                });
            });
        }

        return parsedData;

    }

    getcharactersInfo(charactersInfo, info, infoName, valueName) {
        for (var i = 0; i < charactersInfo.length; i++) {
            if (charactersInfo[i][infoName] == info)
                return charactersInfo[i][valueName];
        }
    }*/
}
