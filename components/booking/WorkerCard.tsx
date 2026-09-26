'use client';
import type { Worker } from '../../data/workers';
import WorkerTrustCard from '../WorkerTrustCard';
export default function WorkerCard({worker,selected,onSelect,labels}:{worker:Worker;selected:boolean;onSelect:()=>void;labels:any}){return <WorkerTrustCard worker={worker} selected={selected} onSelect={onSelect} labels={{...labels,completed:'completed',cooperative:'Cooperative',viewProfile:'View Profile',message:'Message',call:'Call',messageSimulation:'Messaging simulation',callSimulation:'Calling simulation'}}/>}
