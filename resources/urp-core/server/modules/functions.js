import * as alt from 'alt-server';
import * as chat from 'urp-chat';

import Core from '../main';

import { executeSync, insertSync, updateSync, hashString, compareHash, getVectorInFrontOfPlayer, getClosestEntity } from '../libs/utils';

// Utils
const getPlayerIdentifier = (source) => {
    if (!source || !source.valid) {
        return;
    }
    if (!source.hwidHash || !source.hwidExHash || !source.socialID) {
        source.kick(Core.Translate('PLAYER.MISSING_IDENTIFICATORS'))
        return;
    }
    if (source.socialID == 0) {
        source.kick(Core.Translate('PLAYER.MISSING_IDENTIFICATORS'))
        return;
    }
    const finalIdentifier = `${source.hwidHash} ${source.hwidExHash} ${source.socialID}`
    return finalIdentifier;
}

//  Player Login
const login = async(source) => {
    const uID = getPlayerIdentifier(source);
    if (!uID) return;
    const account = await executeSync('SELECT * FROM users WHERE socialID = :socialID', { socialID: source.socialID })
    if (account.length <= 0) {
        const hash = hashString(uID);
        const register = await insertSync("INSERT INTO users (identifier, socialID, banned, whitelisted) VALUES (?, ?, ? ,?)", [hash, source.socialID, 0, 0])
        if (!register) {
            source.kick(Core.Translate('ACCOUNT.REGISTER_ERROR'))
            return
        }
        console.log(Core.Translate('ACCOUNT.NEW_CREATED ', { sID: source.socialID }))
        Core.Character.startCharacter(source)
            // Now we start the character
    } else {
        const dataMatch = compareHash(uID, account[0].identifier);
        if (!dataMatch) {
            source.kick(Core.Translate('ACCOUNT.LOGIN_ERROR'))
            return;
        }
        if (account[0].banned) {
            source.kick(Core.Translate('ACCOUNT.BANNED'))
            return;
        }
        console.log(Core.Translate('ACCOUNT.LOGIN', { playerName: `${source.name}`, sID: `${source.socialID}` }))
        Core.Character.startCharacter(source)
            // Now we start the character
    }
}

// Player utils
const setPosition = (source, x, y, z, model = undefined) => {
    if (model) {
        source.spawn(x, y, z, 0)
        source.model = model;

    }
    source.pos = new alt.Vector3(x, y, z)
}

const getMoney = (source) => {
    return source.playerData.money
}

const getCurrentInventory = (source) => {
    return source.playerData.inventory
}

const getPlayerData = (source, key) => {
    return source.playerData[key]
}

const getIdentityByProximity = (source) => {
    const closestSource = getClosestEntity(source.pos, source.rot, [...alt.Player.all], 10)
    console.log('DEBUG', closestSource)
    if (!closestSource || closestSource === source) {
        alt.emitClient(source, 'notify', 'error', Core.Translate('SYSTEM.LABEL'), Core.Translate('NO_PLAYERS_NEAR'))
        return;
    }
    chat.send(source, `${JSON.stringify(closestSource.playerData.charinfo)} ${closestSource.playerData.ssn}`)
}

// Vehicles
const spawnVehicle = (source, model) => {
    try {
        const fwd = getVectorInFrontOfPlayer(source, 5)
        const vehicle = new alt.Vehicle(model, fwd.x, fwd.y, fwd.z, 0, 0, 0)
        vehicle.numberPlateText = 'STAFF'
        vehicle.engineOn = true
        vehicle.data = {
            metadata: {fuel: 100}
        }
        vehicle.setStreamSyncedMeta('engine', true);
        vehicle.setStreamSyncedMeta('fuel', 100);
    } catch (e) {
        console.error(Core.Translate('VEHICLE.INCORRECT_MODEL', { model: model }));
        throw e;
    }
}

//  Permission system
const addPermission = (source, permission) => {
    if (!source || !source.playerData) return;
    const socialID = source.playerData.socialID
    Core.PermissionList[socialID] = {
        socialID: socialID,
        permission: permission.toLowerCase()
    }
    db.execute('DELETE FROM permissions WHERE socialID = ?', [socialID], undefined, alt.resourceName)
    db.execute('INSERT INTO permissions (name, socialID, permission) VALUES (?, ?, ?)', [source.name, socialID, permission.toLowerCase()],
        undefined, alt.resourceName)
}

const hasPermission = (source, perm) => {
    if (!source || !source.playerData) return false;
    const socialID = source.playerData.socialID
    const permission = perm.toLowerCase()
    if (permission === 'user') {
        return true
    }
    if (!Core.PermissionList[socialID]) {
        return false
    }
    if (Core.PermissionList[socialID].socialID === socialID &&
        Core.PermissionList[socialID].permission === permission || Core.PermissionList[socialID].permission === 'god') {
        return true
    }
    return false
}

const updateIdentity = (source, dt) => {
    if (!source || !source.playerData) return;
    const ssn = source.playerData.ssn
    let data = JSON.parse(dt)
    source.playerData.charinfo.firstname = data.firstname
    source.playerData.charinfo.lastname = data.lastname
    source.playerData.charinfo.birthdate = data.brithdate
    source.playerData.charinfo.gender = data.gender
    updateSync('UPDATE characters SET charinfo = ? WHERE ssn = ?', [JSON.stringify(source.playerData.charinfo), ssn], undefined, alt.resourceName)
}

const emitPlayerData = (source, key, value) => {
    alt.nextTick(() => {
        alt.emitClient(source, 'playerData:set', key, value);
    });
}
const GetSsn = (source, dt) => {
    if (!source || !source.playerData) return;
    const ssn = source.playerData.ssn;
   
    return ssn
  }
  const GetNumber = (source, dt) => {
    if (!source || !source.playerData) return;
    const phone = source.playerData.phone;
   
    return phone
  }
  const createCallPhone = (source, phone) => {
    const target = alt.Player.all.find(s => s.playerData.phone === parseInt(phone))
    if (source.getMeta('inCall') == true || target.getMeta('inCall') == true) return;
    if (!target) return;
    
    alt.emitClient(target, 'Phone:inCall')
    setTimeout(() => {
        Core.Voice.createVoiceChannel(phone, 999999, false)
        Core.Voice.addSourceToChannel(source, phone)
        Core.Voice.addSourceToChannel(target, phone)
        source.setMeta('inCall', true);
        target.setMeta('inCall', true)
    }, 100);
    
  
  }
  
  const inviteCallRequest = (source, phone) => {
   
    if (!source.getMeta('inCall')) {
        const target = alt.Player.all.find(s => s.playerData.phone === parseInt(phone))
        
     
        if (!target) {
            alt.log(`fora da area de cobertura ou o numero esta errado`)
        } else {
            if (!target.getMeta('inCall')) {
                alt.emitClient(target, 'Phone:inviteCallRequest',source.playerData.phone)
            } else(
                alt.log(`ocupado`)
            )
        }
    }
  }
  
  const PhoneTunel = (source,targtEvent,dataRvent,phone)=>{
    const target = alt.Player.all.find(s => s.playerData.phone === parseInt(phone))
    if (target) {
        alt.emitClient(target,targtEvent,target,dataRvent)
    }
  }
  
  //  alt.emitClient(source, 'Phone:GetAllMessageId',result)
  
  
  const endCall = (source, phone) => {
    console.log(phone);
    const target = alt.Player.all.find(s => s.playerData.phone == parseInt(phone))
    if (!target) return
    alt.emitClient(target, 'Phone:endCall')
    alt.emitClient(source, 'Phone:endCall')
    Core.Voice.removeSourceFromChannel(source, phone)
    Core.Voice.removeSourceFromChannel(target, phone)
    Core.Voice.destroyVoiceChannel(phone)
    source.setMeta('inCall', false)  
    target.setMeta('inCall', false)
    console.log(source.getSyncedMeta('inCall'));
    console.log(target.getSyncedMeta('inCall'));
    console.log("close chanel");
  
  }

export default { login,
    getPlayerIdentifier,
    setPosition,
    getMoney,
    hasPermission,
    addPermission,
    getCurrentInventory,
    spawnVehicle,
    emitPlayerData,
    getIdentityByProximity,
    updateIdentity,
    getPlayerData,
    GetSsn,
    createCallPhone,
    inviteCallRequest,
    endCall,
    PhoneTunel,
    GetNumber
}