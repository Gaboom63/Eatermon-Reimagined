const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    w: false,
    a: false,
    s: false,
    d: false
};

document.addEventListener('keydown', e => {
    if (keys.hasOwnProperty(e.key)) {
        keys[e.key] = true;
    }

    if (e.key.toLowerCase() === 'b') {
        isDebugMode = !isDebugMode;
    }
});

document.addEventListener('keyup', e => {
    if (keys.hasOwnProperty(e.key)) {
        keys[e.key] = false;
    }

    if (e.key === 'Enter' && !moving && !inBattle) {

        // --- THE MULTI-PAGE LOGIC ---
        if (inDialogue && currentTalkingNPC) {
            // Move to the next page of text
            currentDialogueIndex++;

            // Check if we still have more pages to show
            if (currentDialogueIndex < currentTalkingNPC.dialogue.length) {
                // Update the text box with the next line!
                loadTextBox(currentTalkingNPC.talkingImg, currentTalkingNPC.dialogue[currentDialogueIndex]);
            } else {
                // We reached the end of the array. Close the box!
                closeTextBox();
                currentTalkingNPC = null; // Forget the NPC so we can talk to someone else later
            }
            return; // Stop the rest of the Enter key code from running
        }

        // 1. Find the player's exact grid position
        const currentCol = Math.round((player.x - mapOffsetX) / TILE_SIZE);
        const currentRow = Math.round((player.y - mapOffsetY) / TILE_SIZE);

        // 2. Figure out which tile is directly in front of them
        let checkCol = currentCol;
        let checkRow = currentRow;

        if (direction === 0) checkRow++;      // Facing Down
        else if (direction === 1) checkRow--; // Facing Up
        else if (direction === 2) checkCol++; // Facing Right
        else if (direction === 3) checkCol--; // Facing Left

        // 3. Look for an NPC on that target tile
        if (currentMap.npcs) {
            for (let i = 0; i < currentMap.npcs.length; i++) {
                let npc = currentMap.npcs[i];

                if (npc.col === checkCol && npc.row === checkRow) {

                    // 4. Make the NPC face the player
                    if (direction === 0) npc.direction = 1;
                    else if (direction === 1) npc.direction = 0;
                    else if (direction === 2) npc.direction = 3;
                    else if (direction === 3) npc.direction = 2;

                    // 5. Start the conversation!
                    currentTalkingNPC = npc;  // Save who we are talking to
                    currentDialogueIndex = 0; // Start at the very first page (index 0)

                    // Fallback just in case you forget to make an NPC's text an array!
                    let firstLine = Array.isArray(npc.dialogue) ? npc.dialogue[0] : npc.dialogue;

                    loadTextBox(npc.talkingImg, firstLine);
                    inDialogue = true;

                    break;
                }
            }
        }
    }
});

function handleInput() {
    if (moving || inBattle || inDialogue || inCutscene) return;

    const moveDistance = TILE_SIZE;

    const currentCol = Math.round((player.x - mapOffsetX) / moveDistance);
    const currentRow = Math.round((player.y - mapOffsetY) / moveDistance);

    if (keys.ArrowDown || keys.s) {
        direction = 0;
        if (!isSolid(currentCol, currentRow + 1)) {
            startMove(0, moveDistance);
        }
    } else if (keys.ArrowUp || keys.w) {
        direction = 1;
        if (!isSolid(currentCol, currentRow - 1)) {
            startMove(0, -moveDistance);
        }
    } else if (keys.ArrowRight || keys.d) {
        direction = 2;
        if (!isSolid(currentCol + 1, currentRow)) {
            startMove(moveDistance, 0);
        }
    } else if (keys.ArrowLeft || keys.a) {
        direction = 3;
        if (!isSolid(currentCol - 1, currentRow)) {
            startMove(-moveDistance, 0);
        }
    }
}
