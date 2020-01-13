---
layout: post
category : pipelines, publications
tagline: ""
tags : [AmpliconTagger, bioinformatics, high performance computing, metagenomics, 16S rRNA amplicons]
---
{% include JB/setup %}


## AmpliconTagger pipeline
It was a long road, but our marker gene pipeline is finally published in [GigaScience](https://academic.oup.com/gigascience/article/8/12/giz146/5670612) and I thought it would be interesting to provide a little historical background on its development.

![Timeline](/images/post_2019-12-12.png)

Roughly 8 years ago, I started my post-doctoral fellow at the DOE - Joint Genome Institute (Lawrence Berkeley National Laboratory) where one of my main task was to implement bioinformatics procedures to process short 16S rRNA amplicon data from our at the time new MiSeq machine. After much efforts, our workflow became the JGI production pipeline for short amplicon data. We named that pipeline [Itagger](https://jgi.doe.gov/wp-content/uploads/2016/06/DOE-JGI-iTagger-methods.pdf) (i.e. for Illumina tagger...) in a spirit of continuation with the previous 454 amplicon pipeline - Pyrotagger (which still lives [here](https://bitbucket.org/berkeleylab/jgi_pyrotagger/src/master/) btw). I continued the developpment of Itagger under a different name (rRNATagger) during my appointment at the Genome Quebec Innovation Centre (GQIC) where I also worked on developing the MUGQIC pipeline that would eventually become GenPipes. I was then appointed at the National Research Council of Canada were I continued the development of rRNATagger under the new name - AmpliconTagger - forking the MUGQIC pipeline core modules to adapt and customize to my own needs. I encourage microbial ecology bioinformaticians to have an attentive look at the paper and the code and fork and adapt to their own needs.
