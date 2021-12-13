import server from 'alt-server';
import * as chat from 'urp-chat';

server.on("playerConnect", (player) => {

    server.emitClient(player, 'EasyNoClip:Notify', "~b~EasyNoClip by ~r~Swox~b~ loaded successfully.")
    server.emitClient(player, 'EasyNoClip:Notify', "Press ~y~F5~w~ to toggle NoClip!")
    server.emitClient(player, 'EasyNoClip:Notify', "Use ~y~W, ~y~A~w~, ~y~S~w~ and ~y~D~w~ to move around!")
    server.emitClient(player, 'EasyNoClip:Notify', "Use ~y~Q~w~ and ~y~E~w~ to rotate your character!")
    server.emitClient(player, 'EasyNoClip:Notify', "Use ~y~Space~w~ to go up and ~y~Shift~w~ to go down!")
    server.emitClient(player, 'EasyNoClip:Notify', "Use ~g~/speed+~w~ & ~g~/speed-~w~ to adjust the speed!")
    server.emitClient(player, 'EasyNoClip:Notify', "~o~Enjoy!")

})


chat.registerCmd('speed+', (player) => {
    server.emitClient(player, 'EasyNoClip:SpeedPlus')
})
  
chat.registerCmd('speed-', (player) => {
    server.emitClient(player, 'EasyNoClip:SpeedMinus')
})

server.onClient('EasyNoClip:On', (player) => {
    server.emitClient(player, 'EasyNoClip:Notify', "~g~No Clip toggled on!")
})

server.onClient('EasyNoClip:Off', (player) => {
    server.emitClient(player, 'EasyNoClip:Notify', "~r~No Clip toggled off!")
})