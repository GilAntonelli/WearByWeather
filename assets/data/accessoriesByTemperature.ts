
import { TemperatureRange, ComfortLevel } from '../../types/suggestion';


export const accessoriesByTemperature: Record<
    TemperatureRange,
    Record<ComfortLevel, { accessories: string[] }>
> = {
    freezing: {
        feel_cold: {
            accessories: [
                "scarfChunky",
                "beanie",
                "faux_fur_earmuffs",
                "gloves",
                "thermal_socks",
                "thermal_vest"
            ]
        },
        neutral: {
            accessories: [
                "scarfMedium",
                "beanie",
                "gloves",
                "thermal_socks"
            ]
        },
        feel_hot: {
            accessories: [
                "scarfLight",
                "cap",
                "gloves"
            ]
        }
    },
    "cold": {
        "feel_cold": {
            "accessories": [
                "scarfMedium",
                "beanie",
                "gloves",
                "thermal_socks"
            ]
        },
        "neutral": {
            "accessories": [
                "scarfLight",
                "cap",
                "gloves"
            ]
        },
        "feel_hot": {
            "accessories": [
                "scarfLight",
                "cap"
            ]
        }
    },
    "chilly": {
        "feel_cold": {
            "accessories": [
                "scarfLight",
                "cap",
                "gloves"
            ]
        },
        "neutral": {
            "accessories": [
                "scarfLight",
                "sunglasses",
                "ear_cover_band"
            ]
        },
        "feel_hot": {
            "accessories": [
                "sunglasses",
                "waterBottle",
            ]
        }
    },
    "mild": {
        "feel_cold": {
            "accessories": [
                "scarfLight",
                "cap",
                "thermal_vest"
            ]
        },
        "neutral": {
            "accessories": [
                "sunglasses",
                "head_bandana"
            ]
        },
        "feel_hot": {
            "accessories": [
                "sunglasses",
                "waterBottle"
            ]
        }
    },
    "comfortable": {
        "feel_cold": {
            "accessories": [
                "scarfLight",
                "panama_hat"
            ]
        },
        "neutral": {
            "accessories": [
                "sunglasses","scarfLight",
                "head_bandana"
            ]
        },
        "feel_hot": {
            "accessories": [
                "sunglasses",
                "waterBottle",
                "cooling_neck_bands"
            ]
        }
    },
    "warm": {
        "feel_cold": {
            "accessories": [
                "scarfLight",
                "bucket_hat"
            ]
        },
        "neutral": {
            "accessories": [
                "sunglasses",
                "panama_hat"
            ]
        },
        "feel_hot": {
            "accessories": [
                "sunglasses",
                "waterBottle",
                "cooling_towel"
            ]
        }
    },
    "hot": {
        "feel_cold": {
            "accessories": [
                "bucket_hat",
                "sunglasses",
                "waterBottle",
            ]
        },
        "neutral": {
            "accessories": [
                "panama_hat",
                "sunglasses",
                "waterBottle",
                "cooling_towel"
            ]
        },
        "feel_hot": {
            "accessories": [
                "sunglasses",
                "waterBottle",
                "portable_handheld_fan",
                "cooling_towel"
            ]
        }
    },
    "extreme_heat": {
        "feel_cold": {
            "accessories": [

                "sunglasses",
                "waterBottle",
                "portable_handheld_fan"            ]
        },
        "neutral": {
            "accessories": [
                "panama_hat",
                "sunglasses",
                "waterBottle",
                "portable_handheld_fan"
            ]
        },
        "feel_hot": {
            "accessories": [
                "cap",
                "sunglasses",
                "waterBottle",
                "portable_handheld_fan", "cooling_towel"
            ]
        },
    },


}

