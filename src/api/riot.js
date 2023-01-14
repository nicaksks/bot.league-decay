const axios = require('axios');
const { api } = require('../util/config.json');

//Headers - Riot Api
axios.defaults.headers = {
  "X-Riot-Token": api
}

async function getSummoner(nickname) {
  return await axios.get(`https://br1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${nickname}`);
}

async function getMatch(puuid) {
  return await axios.get(`https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?count=14&queue=420`)
}

async function getElo(id) {
  return await axios.get(`https://br1.api.riotgames.com/lol/league/v4/entries/by-summoner/${id}`);
}

function getTier(eloData) {
  let tier = "";
  for (let i = 0; i < eloData.length; i++) {
    if (eloData[i].queueType === 'RANKED_SOLO_5x5') {
      tier = eloData[i].tier;
    }
  }
  return tier;
}

async function getMatches(matchData) {
  return await axios.get(`https://americas.api.riotgames.com/lol/match/v5/matches/${matchData}`);
}

async function decay(nickname, interaction) {

  try {
    const summoner = await getSummoner(nickname);
    const puuid = summoner.data.puuid;
    const id = summoner.data.id;
    const match = await getMatch(puuid);
    const elo = await getElo(id);
    const tier = getTier(elo.data);

    for (let i = 0; i < match.data.length; i++) {
      const matches = await getMatches(match.data[i]);
      const timesTamp = new Date(matches.data.info.gameEndTimestamp);
      const today = new Date();

      let difference = (today - timesTamp) / (1000 * 3600 * 24);
      difference = Math.round(difference);

      return calculateDecay(tier, difference, summoner, interaction);
    }
  } catch (e) {
    return interaction.channel.send({ content: `Esse nome de invocador não existe.` });
  }

}

function calculateDecay(tier, difference, summoner, interaction) {

  let days;
  let message;

  if (tier === 'DIAMOND') {
    days = 28 - difference;
  } else if (tier === 'MASTER' || tier === 'GRANDMASTER' || tier === 'CHALLENGER') {
    days = 14 - difference;
  } else {
    return interaction.channel.send({ content: `||<@${interaction.user.id}>|| O **elo** da conta **${summoner.data.name}** é menor que **Diamante** \nApenas contas com elo **Diamante +** possui o sistema de decay ativo.` });
  }

  if (days > 0 && days < 1) {
    message = `||<@${interaction.user.id}>|| conta vai começar a decay em **${days} dia**.`;
  } else if (days <= 0) {
    message = `||<@${interaction.user.id}>|| conta já começou a tomar decay.`;
  } else {
    message = `||<@${interaction.user.id}>|| conta vai tomar decay em **${days} dia(s)**.`;
  }

  return interaction.channel.send({ content: message });
}

module.exports = decay;