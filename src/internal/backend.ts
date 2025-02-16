'use server';

import fs from 'node:fs';
import path from "node:path";
import {AcademicPosition, EmbeddingsDatabase, GrantDatabase, RepresentingVSO} from "@/internal/types";
import util from "util";

async function readFileContents<T>(path: string) : Promise<T> {
    let readFile = util.promisify(fs.readFile);
    let fileContents = await readFile(path, {encoding:'utf8'})
    return JSON.parse(fileContents) as T
}

let CACHED_DATABASE : GrantDatabase | null = null
let CACHED_EMBEDDINGS : EmbeddingsDatabase | null = null

function rootRelativePath(p: string) : string {
    return path.join(process.cwd(), p)
}

export async function readDatabase() : Promise<GrantDatabase> {
    type RecordFmt = {
        title: string,
        description: string,
        eligibility: string[],
        amount_min: number,
        amount_max: number,
        url: string,
        deadline: string,
        next_cycle_start: string,
    }
    const DATABASE_PATH = rootRelativePath('database.json')
    if(CACHED_DATABASE === null) {
        let raw = await readFileContents<{[_: string]: RecordFmt}>(DATABASE_PATH)
        CACHED_DATABASE = {}
        Object.keys(raw).forEach((key) => {
            let record : RecordFmt = raw[key];
            let amountMin = record.amount_min == -1 ? null : record.amount_min;
            let amountMax = record.amount_max == -1 ? null : record.amount_max;
            let url = record.url;
            let deadline = new Date(record.deadline);
            let nextCycleStartDate : Date | null = null
            if(record.next_cycle_start !== "") {
                nextCycleStartDate = new Date(record.next_cycle_start)
            }
            let eligibleAcademicPositions = []
            let eligibleVSORepresentation = []
            for(const elig of record.eligibility){
                if(AcademicPosition.values.includes(elig as any)) {
                    eligibleAcademicPositions.push(elig)
                }
                if(RepresentingVSO.values.includes(elig as any)) {
                    eligibleVSORepresentation.push(elig)
                }
            }
            let grant = {
                id: key,
                title: record.title,
                description: record.description,
                eligibility: record.eligibility,
                eligibleAcademicPositions: eligibleAcademicPositions as AcademicPosition.Type[],
                eligibleVSORepresentation: eligibleVSORepresentation as RepresentingVSO.Type[],
                otherEligibilityConditions: [],
                amountMin,
                amountMax,
                url,
                deadline,
                nextCycleStartDate
            }
            if(CACHED_DATABASE !== null) {
                CACHED_DATABASE[key] = grant
            }
        })
    }
    return CACHED_DATABASE
}
async function readEmbeddings() : Promise<EmbeddingsDatabase> {
    const EMBEDDINGS_PATH = path.join(__dirname, "embeddings.json")
    if(CACHED_EMBEDDINGS === null) {
        CACHED_EMBEDDINGS = await readFileContents<EmbeddingsDatabase>(EMBEDDINGS_PATH)
    }
    return CACHED_EMBEDDINGS
}