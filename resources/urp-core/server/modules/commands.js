import * as alt from 'alt-server';
import * as chat from 'urp-chat';
import Core from '../main';

chat.registerCmd('addItem', (source, args) => {
   const [ item, amount, slot ] = args
   if(!item || !amount){
      alt.emitClient(source, 'client:notify:sendMessage', 
      {iconType: 0, title: 'COMANDOS', 
      message: 'USE /addItem nome_do_item quantidade', 
      color: 'FC2E20', width: 244, duration: 3000}
      )
      return;
   } 
   const isAllowed = Core.Functions.hasPermission(source, 'admin')
   if(isAllowed){
        Core.Character.addItem(source, item, amount, slot ? slot : undefined)
   }else{
    alt.emitClient(source, 'client:notify:sendMessage', 
    {iconType: 0, title: 'SISTEMA DE PERMISSÃO', 
    message: 'Você NÃO possui as permissões necessarias', 
    color: 'FC2E20', width: 244, duration: 3000}
    )
   }
})

chat.registerCmd('c', (source, [model]) => {
   if(!model){
      alt.emitClient(source, 'client:notify:sendMessage', 
      {iconType: 0, title: 'COMANDOS', 
      message: 'use /c (modelo)', 
      color: 'FC2E20', width: 244, duration: 3000}
      )
      return;
  }
  const isAllowed = Core.Functions.hasPermission(source, 'admin')
  if(isAllowed){
      Core.Functions.spawnVehicle(source, model)
  }else{
   alt.emitClient(source, 'client:notify:sendMessage', 
   {iconType: 0, title: 'SISTEMA DE PERMISSÃO', 
   message: 'Você NÃO possui as permissões necessarias', 
   color: 'FC2E20', width: 244, duration: 3000}
   )
  }
})

chat.registerCmd('whitelist', (source, [id])=>{
   if(!id){
      alt.emitClient(source, 'client:notify:sendMessage', 
      {iconType: 0, title: 'COMANDOS', 
      message: 'Especifique um id para adicionar a whitelist', 
      color: 'FC2E20', width: 244, duration: 3000}
      )
      return;
   }
})


chat.registerCmd('cloth', (source, [component, drawable, texture])=>{
   if(!component || !drawable || !texture){
      alt.emitClient(source, 'client:notify:sendMessage', 
      {iconType: 0, title: 'COMANDOS', 
      message: 'use /cloth [component drawable texture]', 
      color: 'FC2E20', width: 244, duration: 3000}
      )
      return;
   }
   Core.Character.changeCloth(source, component, drawable, texture)
})