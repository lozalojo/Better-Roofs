Hooks.on("init", () => {
  /*libWrapper.register(
    "betterroofs",
    "ForegroundLayer.prototype.updateOcclusion",
    occlusionLink,
    "WRAPPER"
  );
 if(!game.modules.get("perfect-vision")?.active){
    libWrapper.register(
        "betterroofs",
        "ForegroundLayer.prototype._drawOcclusionShapes",
        _drawOcclusionShapes,
        "OVERRIDE"
      );
 }*/


function _drawOcclusionShapes(tokens) {
    if (!this.tiles.length) return;
    const rMulti = canvas.scene.getFlag("betterroofs", "occlusionRadius") ?? game.settings.get("betterroofs", "occlusionRadius")
    const g = this.occlusionMask.tokens;
    g.clear().beginFill(0x00FF00, 1.0); // Draw radial occlusion using the green channel
    for (let token of tokens) {
      const c = token.center;
      const r = Math.max(token.w, token.h)*rMulti;
      g.drawCircle(c.x, c.y, r); // TODO - don't drawCircle every time, just move an existing circle with setPosition
    }
    g.endFill();
  }

function occlusionLink(wrapped,...args){
    wrapped(...args);
    for(let otile of canvas.tiles.placeables.filter(t => t.document.overhead)){
        if(_betterRoofs?.isLevels && _levels?.floorContainer?.children.includes(_levels?.floorContainer?.spriteIndex[otile.id])) continue;       
        const occlusionLinkId = otile.document.flags?.betterroofs?.occlusionLinkId;
        if(!occlusionLinkId) continue;
        let occlusionLink = false;
        for(let tile of canvas.tiles.placeables.filter(t => t.document.overhead)){
            if(_betterRoofs?.isLevels && _levels?.floorContainer?.children.includes(_levels?.floorContainer?.spriteIndex[tile.id])) continue;    
            if(!tile.occluded || tile.id === otile.id) continue;
            const occlusionLinkSource = tile.document.flags?.betterroofs?.occlusionLinkSource;
            const tOcclusionLinkId = tile.document.flags?.betterroofs?.occlusionLinkId;
            if(occlusionLinkSource && tOcclusionLinkId === occlusionLinkId){
                occlusionLink = tile;
                break;
            }
        }
        if(occlusionLink){
            otile.occluded = occlusionLink.occluded;
            otile.tile.alpha = otile.document.occlusion.alpha;
            otile.wasOccluded = true;
        }else{
            if(otile.wasOccluded && !otile.occluded){
                otile.wasOccluded = false;
                otile.refresh();
            }
        }
    }

}

});