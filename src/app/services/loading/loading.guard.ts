import { Inject, Injectable } from '@angular/core';
import { CanActivate, CanActivateChildFn, Router } from '@angular/router';
import { loadingService } from './loading.service';

export const loadingGuard:CanActivateChildFn = (rotes) => {

 const router = Inject(Router);
 const activeRouter = true;
 if(activeRouter){
  return true;
 }else{
    router.navigateByUrl("/categorias")
  return false
 }
}
