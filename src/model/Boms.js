import BomsService from "@/service/boms/BomsService";

export default class Boms{
    constructor(status=1,primaryKey="ref",api="boms",ref="",label="",bomtype="",qty="",fk_product="",bom_composition=""){
        this.api=api;
        this.ref=ref;
        this.label=label;
        this.bomtype=bomtype;
        this.qty=qty;
        this.fk_product=fk_product;
        this.bom_composition=bom_composition;
        this.primaryKey=primaryKey;
        this.status=status; // 1=valide, 0=brouillon
    }

    Empty(jsonList){
        return BomsService.Empty(jsonList);
    }


}
