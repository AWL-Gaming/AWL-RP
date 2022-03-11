import Core from 'urp-core';
import db from 'mysql2-wrapper';
import * as alt from 'alt-server';
import { getClosestEntity } from '../../urp-core/server/libs/utils';

import { BOSSMENU_INTERACTIONS } from '../shared/config';

let societyData = [];

const getSocMoney = async (source, socname) => {
    societyData = [];
    const result = await executeSync(
        'SELECT * from society WHERE societyname = ?',
        [socname],
        undefined,
        alt.resourceName
    );
    if (!result[0]) return undefined;
    const socData = result[0];
        if (socData) {
            socData.id = socData.id;
            socData.societyname = socData.societyname;
            socData.societymoney = socData.societymoney;
            societyData.push(socData);
        }
    alt.emitClient(source, 'Society:UpdateSocietyMoney', JSON.stringify(societyData));

};

const getSocEmployess = async (source, socname) => {
    const result = await executeSync(
        'SELECT * from characters',
        [socname],
        undefined,
        alt.resourceName
    );
    const jobgrade = Core.Shared.Jobs[socname].grades;

    for (let i = 0; i < result.length; i++) {
        const empData = result[i];
        if (!empData) return;
        empData.id = empData.id;
        empData.job = JSON.parse(empData.job);
        empData.charinfo = JSON.parse(empData.charinfo);
        if(empData.job.name == socname){
            let charname = `[${empData.id}] ${empData.charinfo.firstname} ${empData.charinfo.lastname} (${empData.job.grade.level})`
            alt.emitClient(source, 'set:societyemp', charname, Object.keys(jobgrade).length);
        }
        if(i >= result.length-1){
            let charname = 'loopended';
            alt.emitClient(source, 'set:societyemp', charname);
        }
    }
};

const showNearRecruit = async (source, currentJob) => {
    let targetPlayer = getClosestEntity(
        source.pos,
        source.rot,
        [...alt.Player.all],
        5
    );
    if (!targetPlayer || targetPlayer === source) return;
    // may be we can use this to show message
    // const charinfo = Core.Functions.getPlayerData(targetPlayer, 'charinfo');
    const joninfo = Core.Functions.getPlayerData(targetPlayer, 'job');
    // alt.log(`${Core.Functions.getPlayerData(targetPlayer, 'id')}
    // ${charinfo.firstname}
    // ${charinfo.lastname}`);
    if(joninfo.name != currentJob) {
        Core.Job.setJob(targetPlayer, currentJob, '0');
        alt.emitClient(
            source,
            'notify',
            'success',
            'JOB',
            'Near by person has joined the organiztion.'
        );
    }

};

const updateSocEmployess = async (source, currentJob, listchange, empid, empgrade) => {
    let match = false;
    let targetplayer;
    alt.Player.all.forEach(async (targetPlayer) => {
        let targetPlayerid = Core.Functions.getPlayerData(targetPlayer, 'id');
        if(targetPlayerid == empid){
            targetplayer = targetPlayer;
            match = true;
            return;
        }
    });
    if(listchange == 'fire'){
        if(!match){
            db.execute(
                'UPDATE characters SET job = ? WHERE id = ?',
                [JSON.stringify(Core.Config.DefaultJob), empid],
                undefined,
                alt.resourceName
            );
        }else {
            Core.Job.setJob(targetplayer, 'unemployed');
        }
    } else {
        if(!match){
            return;
        }
        Core.Job.setJob(targetplayer, currentJob, listchange);
    }
};

const socMoneywithdraw = (source, amount, socname) => {
    if(societyData[0].societymoney < amount) return;
    const totalamount= societyData[0].societymoney - amount;
    updateSocMoney(source, totalamount, socname);
    Core.Money.addMoney(source, 'cash', amount);
};

const setSocMoney = (source, amount) => {
    if (source.playerData.money[moneytype]) {
        source.playerData.money[moneytype] = parseInt(amount);
        updateSocMoney(source);
    }
    return;
};


const socMoneyDeposit = (source, amount, socname) => {
    if (!Core.Money.hasMoney(source, 'cash', amount)) {
        return;
    }
    const totalamount= societyData[0].societymoney + amount;
    Core.Money.getPayment(source, amount);
    updateSocMoney(source, totalamount, socname);
};

const updateSocMoney = (source, money, socname) => {
   if(money < 0) return;
    db.update(
        'UPDATE society SET societymoney = ? WHERE societyname = ?',
        [money, socname],
        undefined,
        alt.resourceName
    );
};

const executeSync = (query, parameters) => {
    return new Promise((resolve, reject) => {
        const resolvePromise = (response) => {
            resolve(response);
        };
        db.execute(query, parameters, resolvePromise, alt.resourceName);
    });
};


alt.onClient('update:societymoney', getSocMoney);
alt.onClient('society:deposit', socMoneyDeposit);
alt.onClient('society:withdraw', socMoneywithdraw);

alt.onClient('get:societyemp', getSocEmployess);

alt.onClient('showrecruit:societyemp', showNearRecruit);

alt.onClient('update:societyemp', updateSocEmployess);