import React, {  } from "react";
import { 
    EffectComposer, 
    Noise, 
    Vignette,
    Bloom
} from "@react-three/postprocessing";

export default function PostProcessing() {
    return(
        <EffectComposer>
            <Noise opacity={0.025} />
            <Bloom />
            <Vignette eskil={false} offset={0.1} darkness={0.25} />
        </EffectComposer>
    )
}
