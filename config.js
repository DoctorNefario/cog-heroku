exports.prefix = "~";

exports.roleChannel = "447299800761892865";
exports.roleMessage = "746693332930920518";

exports.roleContent = `Get your roles here`

exports.roleAddReason = null;
exports.roleRemoveReason = null;

exports.editChannel = "548484235976245258";
exports.deletedChannel = "548484352212992010";
exports.miscChannel = "343796978280300555";

exports.guildID = "151656795016790017";
exports.staffID = "181980396542492683";

exports.deleteEmoji = "🚯";

exports.acceptedEmoji = "✅";

const roleList = [
    { // Accepted
        emoji: "✅",
        id: "341991178725621760",
        removable: false
    },
    { // Anthem
        emoji: "548997010016043018",
        id: "548994806144303118",
        removable: true
    },
    { // Apex Legends
        emoji: "542237535036899328",
        id: "545145352882487297",
        removable: true
    },
    { // Destiny 2
        emoji: "430665230293532682",
        id: "350909036272549890",
        removable: true
    },
    { // Monster Hunter
        emoji: "482885427964018706",
        id: "486489485991870464",
        removable: true
    },
    { // Overwatch
        emoji: "329180882277498880",
        id: "344015372581863424",
        removable: true
    },
    { // Rainbow Six Siege
        emoji: "430658203328577536",
        id: "421926616407474176",
        removable: true
    },
    { // Titanfall 2
        emoji: "278835758998224896",
        id: "244293117019160586",
        removable: true
    },
    { // Warframe
        emoji: "363829883908128780",
        id: "360984534172565505",
        removable: true
    },
    { // Other games
        emoji: "387858666973298688",
        id: "415409403655749632",
        removable: true
    },
    { // See all
        emoji: "455608619409473536",
        id: "455607898089848842",
        removable: true
    },
];

const roleMap = new Map();

roleList.forEach(({ emoji, id, removable }) => {
    roleMap.set(emoji, { id, removable });
});

exports.roles = roleMap;
