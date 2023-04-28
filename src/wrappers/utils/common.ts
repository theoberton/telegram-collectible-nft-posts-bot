import Prando from "prando";
import { Buffer } from "npm-buffer";
import { Address } from "ton-core";

export function randomAddress() {
    const random = new Prando();
    const hash = Buffer.alloc(32);
    for (let i = 0; i < hash.length; i++) {
        hash[i] = random.nextInt(0, 255);
    }
    return new Address(0, hash);
}