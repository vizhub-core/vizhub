import { useEffect } from 'react';

// If the viz embed should be branded,
// but the URL param is not set,
// This may come as a surprise to the user.
// This is the case where either:
// - Someone is sent a full screen URL for a viz
// - Someone is viewing a Web page that embeds a viz
// This is an opportunity to inform the user about VizHub Premium.
export const useBrandedEmbedNotice = ({
  isEmbedMode,
  isEmbedBrandedURLParam,
  isEmbedBranded,
}) => {
  useEffect(() => {
    if (
      isEmbedMode &&
      !isEmbedBrandedURLParam &&
      isEmbedBranded
    ) {
      console.log(
        [
          `  @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@        
  @@                                                                                           @@        
  @@                                                                                           @@        
  @@      @@@@@       @@@   @@@                 @@@@      @@@@                @@@@             @@        
  @@        @@@@@     @@@                       @@@@      @@@@                @@@@             @@        
  @@          @@@@@   @@@   @@@   @@@@@@@@@@@   @@@@      @@@@   @@@    @@@@  @@@@ @@@@@       @@        
  @@            @@@@@ @@@   @@@   @@@@@@@@@@    @@@@ @@@@@@@@@   @@@    @@@@  @@@@@@@@@@@@     @@        
  @@              @@@@@@@   @@@        @@@      @@@@   @@@@@@@   @@@    @@@@  @@@@     @@@     @@        
  @@                @@@@@   @@@      @@@@       @@@@      @@@@   @@@    @@@@  @@@@     @@@     @@        
  @@                  @@@   @@@     @@@@        @@@@      @@@@   @@@@  @@@@   @@@@@@@@@@@@     @@        
  @@                    @   @@@   @@@@@@@@@@@   @@@@      @@@@    @@@@@@@@    @@@@ @@@@@       @@        
  @@                                                      @@@@                                 @@        
  @@                                                      @@@@                                 @@        
  @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@   @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@`,
          '',
          '  Thanks for using VizHub to embed your viz!',
          '  To remove the branding on your embedded viz,',
          '  upgrade to VizHub Premium.',
          '  https://vizhub.com/pricing',
        ].join('\n'),
      );
    }
  }, [isEmbedBrandedURLParam, isEmbedBranded]);
};
