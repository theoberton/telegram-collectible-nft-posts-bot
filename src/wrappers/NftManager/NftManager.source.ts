/* Generated automatically from ton/scripts/manager.update-test-wrapper.ts */
import { Cell } from "ton-core";

const NftManagerCodeBoc =
  "te6ccgECKAEAB98AART/APSkE/S88sgLAQIBYgIDBMTQAdDTAwFxsMABkX+RcOIB+kABINdJgQELuvLgiCDXCwoggwm6IYEE/7qx8uCIgwm68uCJVFBTA28E+GEC+GLtRNDUAfhj0gABjxP4KNcLCoMJuvLgids8B9FVBds84w1VFyMkJQQCASAZGgIK2zww2zwFBgTycCHXScIflTAg1wsf3gKSW3/gIYIQGfwtRLqOxzHTHwGCEBn8LUS68uCB+kABINdJgQELuvLgiCDXCwoggwm6IYEE/7qx8uCIgwm68uCJMVVw2zwnggCawgjHBRfy9BBnVQR/4CGCEEMsXPe64wIhghCEr4XDuuMCIQwHCAkBFsj4QwHMfwHKAFVwGAGaMdMfAYIQQyxc97ry4IH6QAEg10mBAQu68uCIINcLCiCDCbohgQT/urHy4IiDCbry4IkxVXDbPDf4J28Qggr68IChgTVqAcL/8vRVBX8MAgox2zxsFgoLA/6CEEeJAGu6jskx0x8BghBHiQBruvLggdM/0z/6QCHXCwHDAI4iASDXSYEBC7ry4Igg1wsKIIMJuiGBBP+6sfLgiIMJuvLgiZIxbeJDMGwT2zx/4AGCEJRqmLa6jqLTHwGCEJRqmLa68uCB0z8BMcgBghCv+Q9XWMsfyz/J2zx/DQ4PAH7THwGCEISvhcO68uCB0z/U0z/TH9Mf+kABINdJgQELuvLgiCDXCwoggwm6IYEE/7qx8uCIgwm68uCJFhUUQzAD7BB9EGwQWxBKEDlI3Ns8NV8Dggr68ID4J28QoXC2CfhBbyQTXwMBoYIJMS0AoYE1aiHC//L0KIIJMS0ACchZdFADyx/LP8zJVESZfwNwQwNtbds8+EIIyAGCENUydttYyx/LP8lIcH8DcEMDbW3bPFB2EDVVAn8MFhYAEPhCKMcF8uCEAvT4QW8kECNfA1MBbrOYMAEgbvLQgAGRMuLIWCDXSYEBC7ry4Igg1wsKIIMJuiGBBP+6sfLgiIMJuvLgic8W2zwBzMkpgBSpBPgnbxCCCvrwgKEroSGhggr68IChggnJw4ChgTVqIcL/8vSCALpiK8AAU2y5sfL0gVykKhARARp/+EJwWAOAQgFtbds8FgAG4DBwAATIyQO8+CO58vSCAIzAKcAAKvgjvLHy9CvCAJEx4w2CCvrwgIIJMS0AJkYTBMhVMHFQBcsfE8s/yz8B+gLMyVRLRH8DcEMDbW3bPHEDyAGCENUydttYyx/LP8kTf1UwbW3bPBIWFgTAcYv05GVCBpdGVtIG1pbnRlZI2zwpVE4wf1UwbW3bPI0IYAEhfaqHP5XZVjn5O2M4Bn90xcbzurR70mJ0mjtbaDk4zHGL9ORlQgaXRlbSBtaW50ZWSNs8ECMQJH9VMG1tExYTFAFCyHAByx9vAAFvjG1vjAHbPG8iAcmTIW6zlgFvIlnMyegxFQEE2zwWALog10oh10mXIMIAIsIAsY5KA28igH8izzGrAqEFqwJRVbYIIMIAnCCqAhXXGFAzzxZAFN5ZbwJTQaHCAJnIAW8CUEShqgKOEjEzwgCZ1DDQINdKIddJknAg4uLoXwMBzshxAcoBUAcBygBwAcoCUAUg10mBAQu68uCIINcLCiCDCbohgQT/urHy4IiDCbry4InPFlAD+gJwAcpoI26zJW6zsZczMwFwAcoA4w0hbrOcfwHKAAEgbvLQgAHMlTFwAcoA4skB+wAXAJh/AcoAyHABygBwAcoAJG6znX8BygAEIG7y0IBQBMyWNANwAcoA4iRus51/AcoABCBu8tCAUATMljQDcAHKAOJwAcoAAn8BygACyVjMAPhQhyDXSYEBC7ry4Igg1wsKIIMJuiGBBP+6sfLgiIMJuvLgic8WUAUg10mBAQu68uCIINcLCiCDCbohgQT/urHy4IiDCbry4InPFlAD+gLLH8sfyx9YINdJgQELuvLgiCDXCwoggwm6IYEE/7qx8uCIgwm68uCJzxbMye1UAgEgGxwA3b3ejBOC52Hq6WVz2PQnYc6yVCjbNBOE7rGpaVsj5ZkWnXlv74sRzBOBAq4A3AM7HKZywdVyOS2WHBOA3qTvfKost446np7wKs4ZNBOE7Lpy1Zp2W5nQdLNsozdFJBOCBnOrTzivzpKFgOsLcTI9lARHuq3u1E0NQB+GPSAAGPE/go1wsKgwm68uCJ2zwH0VUF2zzjDYIyQlHQIBIB8gAQTbPB4ACBBnXwcER7SjvaiaGoA/DHpAADHifwUa4WFQYTdeXBE7Z4D6KqC7Z5xhsCMkJSEER7UM3aiaGoA/DHpAADHifwUa4WFQYTdeXBE7Z4D6KqC7Z5xhsCMkJSYBBNs8IgAEXwcAwvpAIdcLAcMAjiIBINdJgQELuvLgiCDXCwoggwm6IYEE/7qx8uCIgwm68uCJkjFt4gH6ANMf0x/TH/pAASDXSYEBC7ry4Igg1wsKIIMJuiGBBP+6sfLgiIMJuvLgiQHUVWAAIvhBbyQQI18DJ244B7MwJlVQAPj6QAEg10mBAQu68uCIINcLCiCDCbohgQT/urHy4IiDCbry4IkB+kABINdJgQELuvLgiCDXCwoggwm6IYEE/7qx8uCIgwm68uCJAfoA0x/TH9Mf+kABINdJgQELuvLgiCDXCwoggwm6IYEE/7qx8uCIgwm68uCJAdRVcGwYAQTbPCcAAjA=";
const NftManagerSystemBoc =
  "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";

export const NftManagerCodeCell = Cell.fromBase64(NftManagerCodeBoc);
export const NftManagerSystemCell = Cell.fromBase64(NftManagerSystemBoc);
