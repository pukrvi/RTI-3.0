# Codex pass 1 — Hindi interface copy

Run from `prototype/app` with Codex CLI 0.144.3:

```bash
codex exec --skip-git-repo-check --sandbox read-only "Review the Hindi interface copy of this prototype. It is an unofficial demo of a simpler Right to Information filing service for India, aimed at first-time rural filers on cheap phones.

Compare src/i18n/hi.json against src/i18n/en.json key by key. The two files have identical key sets.

Flag only real problems, in this order of importance:
1. Hindi that reads as machine translation, or that a first-time rural filer would not understand.
2. Wrong register. It should be plain, respectful, sarkari-form-literate but not bureaucratic. Not chatty.
3. Terminology used inconsistently across keys (for example the words for 'application', 'authority', 'deadline', 'mock').
4. Untranslated English that should be Hindi. Keep genuine proper nouns, and keep the one verbatim English status string 'RTI REQUEST APPLICATION RETURNED TO APPLICANT' as it is - it is quoted from the live government portal on purpose.
5. Statutory references that are wrong (RTI Act 2005 sections 6(2), 7(1), 7(2), 8(1)(j), 19(1); RTI Rules 2012; the 30 day timelines; the Rs 10 fee; no fee for a first appeal).

Output a numbered list. For each: the key, the current Hindi, your suggested replacement, and one line saying why. If a string is fine, do not mention it. Be strict: I would rather have 8 real problems than 40 stylistic preferences. Do not edit any files."
```

## Codex's reply, verbatim

1. `check.corpusNote`  
   Current: “...हर प्राधिकरण की धारा-4 स्वतःप्रकटन...”  
   Suggested: “...हर लोक प्राधिकरण द्वारा धारा 4 के तहत स्वतः प्रकाशित जानकारी...”  
   Why: “धारा-4 स्वतःप्रकटन” मशीन-अनुवाद जैसा और सामान्य पाठक के लिए अस्पष्ट है।

2. `authority.unclearBody`  
   Current: “आपका प्रश्न स्वतः मार्ग निर्धारण के लिए पर्याप्त मेल नहीं खाया।”  
   Suggested: “आपके प्रश्न से अपने-आप सही लोक प्राधिकरण तय नहीं हो पाया।”  
   Why: “स्वतः मार्ग निर्धारण” तकनीकी और अनावश्यक रूप से दफ़्तरी है।

3. `compose.filingWith`  
   Current: “आवेदन जा रहा है”  
   Suggested: “जिस लोक प्राधिकरण को आवेदन भेजा जा रहा है”  
   Why: यह अधूरा और अस्पष्ट है; मूल अर्थ “Filing with” स्पष्ट नहीं होता।

4. `compose.tipsTitle`  
   Current: “किस आवेदन का उत्तर मिल पाता है”  
   Suggested: “ऐसा आवेदन कैसे लिखें जिसका उत्तर दिया जा सके”  
   Why: मौजूदा वाक्य अस्वाभाविक है और शीर्षक की तरह नहीं पढ़ता।

5. `track.regNoMock`  
   Current: “...भुगतान मिलान के 24–48 कार्य घंटों बाद...”  
   Suggested: “...भुगतान की पुष्टि होने के 24–48 कार्य घंटों बाद...”  
   Why: “भुगतान मिलान” मशीन-जैसा है; यहाँ भुगतान साफ़ होने का अर्थ है, मिलान का नहीं।

6. `appeal.intro`  
   Current: “आपके आवेदन से भरी हुई। हर खाना बदला जा सकता है।”  
   Suggested: “यह अपील आपके आवेदन की जानकारी से पहले से भरी है। हर खाता बदला जा सकता है।”  
   Why: पहला वाक्य अधूरा है; “खाना” इस संदर्भ में अनौपचारिक लगता है।

7. `about.mock3`  
   Current: “अधिकारी के उत्तर। हमारे लिखे हुए, डेमो बटन से चलते हैं।”  
   Suggested: “अधिकारी के उत्तर। ये हमने केवल डेमो के लिए लिखे हैं और डेमो बटन दबाने पर दिखते हैं।”  
   Why: “बटन से चलते हैं” अर्थहीन-सा मशीन अनुवाद है।

8. `about.mock6`  
   Current: “...अस्थायी की-वैल्यू भंडार में रहता है और टिकाऊ नहीं है।”  
   Suggested: “...अस्थायी भंडारण में रहता है और स्थायी रूप से सुरक्षित नहीं रहता।”  
   Why: “की-वैल्यू भंडार” और “टिकाऊ” तकनीकी/अप्राकृतिक हैं, खासकर पहली बार आवेदन करने वाले व्यक्ति के लिए।