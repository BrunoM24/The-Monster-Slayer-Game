function getRandomValue(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

Vue.createApp({
    data() {
        return {
            playerHealth: 100,
            monsterHealth: 100,
            specialAttackCooldown: 0,
            healCooldown: 0,
            winner: null,
            battleLog: []
        }
    },
    computed: {
        monsterBarStyles() {
            return {width: this.monsterHealth + '%'}
        },
        playerBarStyles() {
            return {width: this.playerHealth + '%'}
        },
        isSpecialAttackAvailable() {
            return this.specialAttackCooldown > 0;
        },
        isHealAvailable() {
            return this.healCooldown > 0;
        }
    },
    watch: {
        playerHealth(value) {
            if (value <= 0 && this.monsterHealth <= 0) {
                this.winner = 'draw';
            } else if (value <= 0) {
                this.winner = 'monster'
            }
        },
        monsterHealth(value) {
            if (value <= 0 && this.playerHealth <= 0) {
                this.winner = 'draw'
            } else if (value <= 0) {
                this.winner = 'player'
            }
        }
    },
    methods: {
        startGame() {
            this.playerHealth = 100;
            this.monsterHealth = 100;
            this.specialAttackCooldown = 0;
            this.healCooldown = 0;
            this.winner = null;
            this.battleLog = []
        },
        playerAttack() {
            const attackValue = getRandomValue(5, 12)
            this.monsterHealth = this.monsterHealth - attackValue;

            if (this.monsterHealth < 0) {
                this.monsterHealth = 0;
            }

            this.addBattleLog('Player', 'Attack', attackValue);
            this.endTurn();
        },
        monsterAttack() {
            const attackValue = getRandomValue(9, 15);
            this.playerHealth -= attackValue;

            this.addBattleLog('Monster', 'Attack', attackValue);

            if (this.playerHealth < 0) {
                this.playerHealth = 0;
            }
        },
        playerSpecialAttack() {
            const attackValue = getRandomValue(10, 25);
            this.monsterHealth -= attackValue;
            if (this.monsterHealth < 0) {
                this.monsterHealth = 0;
            }
            this.specialAttackCooldown = 3;

            this.addBattleLog('Player', 'Special Attack', attackValue);
            this.endTurn();
        },
        heal() {
            const healValue = getRandomValue(15, 20)
            this.playerHealth = this.playerHealth + healValue > 100 ? 100 : this.playerHealth + healValue;
            this.healCooldown = 4;
            this.addBattleLog('Player', 'Heal', healValue);
            this.endTurn();
        },
        endTurn() {
            this.specialAttackCooldown = this.specialAttackCooldown > 0 ? this.specialAttackCooldown - 1 : 0;
            this.healCooldown = this.healCooldown > 0 ? this.healCooldown - 1 : 0;
            this.monsterAttack();
        },
        surrender() {
            this.winner = 'monster';
        },
        addBattleLog(who, what, value) {
            this.battleLog.unshift({
                actionBy: who,
                actionType: what,
                actionValue: value
            });
        }
    }
}).mount('#game');
