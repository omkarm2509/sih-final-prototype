'use client';
import {useEffect} from 'react';
import {ensureDataIntegrity} from '../lib/store';
export default function DataIntegrity(){useEffect(()=>{ensureDataIntegrity();},[]);return null;}
