import * as alt from 'alt-client';
import { Menu, MenuItem, MenuColor, BackMenuItem, InputType, InputMenuItem, ListMenuItem, CheckboxMenuItem, ListItem, ForwardMenuItem } from './utils/menu';
import { BOSSMENU_INTERACTIONS } from '../shared/config';
import * as natives from 'natives';
import Core from 'urp-core';

let isOpen;

let cds = -1;
let currentJob;
let onDuty;
let isBoss;
let socData;
let empData;
let menustart = false;
let listchange = false;
let employeedata;
let optionselect;
let distancetomenu;

const getClosestBossMenu = () => {
    for (let i = 0; i < BOSSMENU_INTERACTIONS.length; i++) {
        const bossmenuPos = new alt.Vector3(
            BOSSMENU_INTERACTIONS[i].x,
            BOSSMENU_INTERACTIONS[i].y,
            BOSSMENU_INTERACTIONS[i].z
        );
        const distanceToBossmenu = alt.Player.local.pos.distanceTo(bossmenuPos);
        if (distanceToBossmenu <= 10) {
            return true;
        }
    }
    return false;
};


let menu = new Menu(
    'BOSS Menu',
    'Select one of the options',
    MenuColor.LIGHTBLUE
);

let bossmenu = new Menu(
    'BOSS Menu',
    'Manage Storage/Outfits',
    MenuColor.LIGHTBLUE
);

let societymenu = new Menu(
    'Society Money',
    'View/Manage Society Money',
    MenuColor.LIGHTBLUE
);

let empmenu = new Menu(
    'Employee Management',
    'View/Manage Employees',
    MenuColor.LIGHTBLUE
);

menu.addItem(new MenuItem('Boss Menu', 'mdi-cancel'));
menu.addItem(new MenuItem('Society money', 'mdi-emoticon-wink'));
menu.addItem(new MenuItem('Employee Management', 'mdi-walk'));
menu.addItem(new MenuItem('Recruit Menu', 'mdi-emoticon'));

bossmenu.addItem(new MenuItem('Storage', 'mdi-emoticon-wink'));
bossmenu.addItem(new MenuItem('Outfits', 'mdi-walk'));
bossmenu.addItem(new BackMenuItem(menu, "Go Back", "mdi-sitemap"));

menu.onSelect(({ text }) => {
    switch (text) {
        case 'Boss Menu':
            menu.hide();
            bossmenu.show();
            break;
        case 'Society money':
            menu.hide();
            societymenu.clear();
            alt.emitServer('update:societymoney', currentJob);
                alt.setTimeout(() => {
                    societymenu.addItem(new MenuItem(`Current Money: $ ${socData[0].societymoney}`, 'mdi-emoticon-wink'));
                societymenu.addItem(
                    new InputMenuItem(InputType.TEXT, "$....", "Deposit", "mdi-text")
                );
                societymenu.addItem(
                    new InputMenuItem(InputType.TEXT, "$....", "Withdraw", "mdi-text")
                );
                societymenu.addItem(new BackMenuItem(menu, "Go Back", "mdi-sitemap"));
                societymenu.show();
                },200);
            break;
        case 'Employee Management':
            menu.hide();
            empmenu.clear();
            alt.emitServer('get:societyemp', currentJob);
            break;
        case 'Recruit Menu':
            alt.emitServer('showrecruit:societyemp',currentJob);
            break;
    }
});

alt.onServer('Society:UpdateSocietyMoney', RefreshSociety);

function RefreshSociety(data) {
    socData = JSON.parse(data);
}

alt.onServer('set:societyemp', RefreshEmployees);
let grade = [];
function RefreshEmployees(data, jobgrade) {
    empData = data;
    alt.log(empData);
        if(empData == "loopended"){
            empmenu.addItem(new BackMenuItem(menu, "Go Back", "mdi-sitemap"));
            empmenu.show();
        } else {
            grade.push(new ListItem("--", "nill"),new ListItem("-1", "fire"));
            for (var i = 0; i < jobgrade; i++) {
                grade.push(new ListItem(`${i}`, `${i}`));
            }
                empmenu.addItem(
                    new ListMenuItem(
                        grade
                        ,
                        0,
                        `${empData}`,
                        "mdi-format-list-bulleted"
                    )
                );
        }
}


societymenu.onSelect(({ text }) => {
    switch (text) {
        case 'Boss Menu':
            menu.hide();
            bossmenu.show();
            break;
        case 'Society money':
            menu.hide();
            societymenu.show();
            break;
    }
});

societymenu.onInputChange((item, input) => {
    if (item.text == 'Deposit') {
        let depositamount = parseInt(input);
        if(!depositamount) return;
        alt.emitServer('society:deposit', depositamount, currentJob);
        societymenu.hide();
        menu.show();
    }else if (item.text == 'Withdraw') {
        let withdrawamount = parseInt(input);
        if(!withdrawamount) return;
        alt.emitServer('society:withdraw', withdrawamount, currentJob);
        societymenu.hide();
        menu.show();
    }
});

empmenu.onListItemChange((item, newItem, oldItem) => {
    listchange = newItem.value;
    employeedata = item.text;
    optionselect = true;
});

empmenu.onSelect((item) => {
    if(listchange == undefined || listchange =='--' || !optionselect) return;
    optionselect = false;
    const myArray = employeedata.split(" ");
    const empid = myArray[0].match(/\d+/);
    const empcgrade = myArray[3].match(/\d+/);
    alt.log(`${myArray}, ${empid}, ${empcgrade}, ${listchange}`);
    alt.emitServer('update:societyemp', currentJob, listchange, empid, empcgrade);
    alt.setTimeout(() => {
        if(isBoss == undefined){
            empmenu.hide();
            menu.hide();
        }else{
            empmenu.hide();
            menu.show();
        }
    },200);
});

// alt.on('playerData:changed', (key, value, old) => {
//     if (!isOpen) return;
//     if (key === 'inInteraction' && !value && old) {
//         menu.hide();
//         isOpen = false;
//     }
// });

alt.on('keydown', (key) => {
    if(cds == -1) return;
    let diststartJob = alt.Player.local.pos.distanceTo(BOSSMENU_INTERACTIONS[cds]) < 1.5;
    if (key == 69 && diststartJob) {
        menu.show();
        isOpen = true;
    }
});

alt.everyTick(async () => {
    distancetomenu = getClosestBossMenu();
    if(!distancetomenu) return;
    currentJob = Core.Functions.getJobInfo('name');
    onDuty = Core.Functions.getJobInfo('onDuty');
    isBoss = Core.Functions.getJobInfo('isboss');
    if(!onDuty || isBoss == undefined) return cds = -1;
        switch (currentJob) {
            case 'police':
                cds=0;
                break;
            case 'ambulance':
                cds=1;
                break;
            default:
                cds = -1;
                break;
        }
        let dist = alt.Player.local.pos.distanceTo(BOSSMENU_INTERACTIONS[cds]) < 1.5;
        if (!dist) {
            if(menustart){
                menu.hide(); 
                societymenu.hide();
                menustart = false; 
                return;
            }
            return;
        }
        drawMarker(BOSSMENU_INTERACTIONS[cds]);
        Core.Utils.drawTextHelper('PRESS ~r~E~w~ OPEN BOSS MENU', 0.5, 0.93);
        if(!menustart){
            menustart = true;
        }
});

function drawMarker(pos) {
    natives.drawMarker(
        21,
        pos.x,
        pos.y,
        pos.z - 0,
        0,
        0,
        0,
        0,
        180,
        0,
        0.5,
        0.5,
        0.5,
        0,
        0,
        255,
        50,
        true,
        true,
        2,
        1,
        0,
        0,
        false
    );
}