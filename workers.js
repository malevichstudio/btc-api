'use strict';

import models from "./models";
import checkPaymentsStatus from "./api/blockonomics/checkPaymentsStatus";
import checkPayoutsStatus from "./api/blockchain/checkPayoutsStatus";
import getWallets from "./api/getWallets";

const paymentWorker = async () => {
    const wallets = (await getWallets()).map(item => item.wallet);
    setTimeout(async function run() {
        while(wallets.length) {
            await checkPaymentsStatus(wallets.splice(0,50));
            setTimeout(await run, 30 * 1000);
        }
    }, 1);
};

const payoutWorker = async () => {
    const payouts = await models.Transaction.findAll({
        where:{
            status: 'PENDING',
            type: 'PAYOUT',
        },
        raw: true,
    });

    if (!payouts.length) {
        return;
    }
    const transactions = payouts.map(payout => payout.txid);

    await checkPayoutsStatus(transactions);
};

export default async () => {
    setTimeout(async function run() {
        console.log(`Run payment workers`);
        await paymentWorker();
        await payoutWorker();
        console.log(`Waiting 30 sec`);
        setTimeout(await run, 30 * 1000);
    }, 1);
};
