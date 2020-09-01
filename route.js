'use strict';

import models from "../models";
import getUser from "../api/getUser";

module.exports = async ({request}, callback) => {
    try {
        const userStructure = await models.Structure.findOne({
            where: {
                link: request.link,
            }
        });
        if (!userStructure) {
            return callback(new Error('Structure not found'));
        }
        const sponsorStructure = await models.Structure.findOne({
            where: {
                id: userStructure.parentId,
            },
        });
        if (!sponsorStructure) {
            return callback(new Error('Sponsor structure not found'));
        }

        const sponsor = await getUser(sponsorStructure.userId);

        if (!sponsor) {
            return callback(new Error('Sponsor not found'));
        }

        callback(null, {
            link: sponsorStructure.link,
            announce: sponsor.announce,
        });
    } catch (e) {
        console.error(e);
        callback(e);
    }

};