const { withAndroidManifest } = require("@expo/config-plugins");

module.exports = function androidManifestPlugin(config) {
    return withAndroidManifest(config, async (config) => {
        let androidManifest = config.modResults.manifest;

        androidManifest["queries"].push({
            intent: [
                {
                    action: [
                        {
                            $: {
                                "android:name": "android.intent.action.VIEW",
                            },
                        },
                    ],
                    data: [
                        {
                            $: { "android:scheme": "wc" },
                        },
                    ],
                },
            ],
        });

        return config;
    });
};
