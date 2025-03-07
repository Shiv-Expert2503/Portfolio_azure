import { k, gg, im, intern, upwork, logoblack, linkdin, x, shopify } from "../assets/images";
import {
    car,
    contact,
    css,
    estate,
    git,
    github,
    html,
    linkedin,
    mongodb,
    pricewise,
    snapgram,
    summiz,
    threads,
    flask,
    tensorflow,
    scikitlearn,
    python,
    deeplearning,
    mlops,
    aws,
    azure,
    cpp,
    docker,
    keras,
    opencv
} from "../assets/icons";
import { a } from "@react-spring/three";

// ----------------------------------Skills
export const skills = [
    {
        imageUrl: python,
        name: "Python",
        type: "Frontend",
    },
    {
        imageUrl: scikitlearn,
        name: "Scikitlearn",
        type: "Frontend",
    },
    {
        imageUrl: deeplearning,
        name: "Deeplearning",
        type: "Backend",
    },
    {
        imageUrl: tensorflow,
        name: "Tensorflow",
        type: "Animation",
    },
    {
        imageUrl: opencv,
        name: "Opencv",
        type: "Computer Vision",
    },
    {
        imageUrl: keras,
        name: "Keras",
        type: "Frontend",
    },
    {
        imageUrl: mlops,
        name: "Mlops",
        type: "Frontend",
    },
    {
        imageUrl: mongodb,
        name: "Mongodb",
        type: "Database",
    },
    {
        imageUrl: cpp,
        name: "C++",
        type: "Frontend",
    },
    {
        imageUrl: html,
        name: "HTML",
        type: "Frontend",
    },
    {
        imageUrl: css,
        name: "CSS",
        type: "Frontend",
    },
    {
        imageUrl: flask,
        name: "Flask",
        type: "Backend",
    },
    {
        imageUrl: git,
        name: "Git",
        type: "Version Control",
    },
    {
        imageUrl: github,
        name: "GitHub",
        type: "Version Control",
    },
    {
        imageUrl: aws,
        name: "AWS",
        type: "State Management",
    },
    {
        imageUrl: azure,
        name: "AZURE",
        type: "Frontend",
    },
    {
        imageUrl: docker,
        name: "Docker",
        type: "Frontend",
    }
];

// ----------------------------------Experience
export const experiences = [
    {
        title: "SDE Intern",
        company_name: "itmtb",
        icon: intern,
        iconBg: "#FFE7A7",
        date: "January 2024 - March 2024",
        points: [
            " Developed a Python-based automated script leveraging Generative AI (LLM) and PyTesseract to extract critical financial data from lengthy auditor reports (PDFs) and output structured JSON, reducing manual effort by 80% and improving data accuracy.",
            " Designed and implemented a rating generation system using LLM to analyze company financials (e.g. tangible networth) and produce detailed ratings with justifications, enhancing client decision-making processes.",
            "Built a modular script to identify report types and extract relevant information, improving scalability and adaptability for diverse client requirements.",
            " Optimized web scraping workflows by integrating a priority queue data structure, reducing scraping time by 40% for large company websites, and ensuring efficient data retrieval.",
            " Automated LLM fine-tuning processes to enhance model performance for generating company descriptions, ratings, and writeups, resulting in improved output quality and client satisfaction.",
            " Collaborated closely with clients to understand requirements, deliver tailored solutions, and ensure alignment with business goals, leading to positive client feedback and repeat engagements.",
        ],
    },
    {
      title: "FreeLancer",
      company_name: "Upwork",
      icon: upwork,
      iconBg: "#B7FFC9",
      date: "November 2023 - Present",
      points: [
        "I have completed 1 project so far on Upwork.",
        "It was about scrapping the data for the client.",
        "Gained a lot of experience as the data which need to be scrapped is from google serps.",
      ],
    },
    {
      title: "Competitions Contributor",
      company_name: "Kaggle",
      icon: k,
      iconBg: "#accbe1",
      date: "March 2020 - April 2021",
      points: [
        "Constantly participating in Kaggle Competitions.",
        "Achieved rank 3 in one of the hackathons I attended out there.",
        "Implemented a variety of Deep Learning models and CoreML.",
        "I also host the models using pipelines for the development of MLOps skills.",
      ],
    },
    {
      title: "Open Source Contributor",
      company_name: "Github",
      icon: gg,
      iconBg: "#6E6E6E",
      date: "April 2023 - Present",
      points: [
        "Around April 2023 I started contributing to open source projects on Github.",
        "Participated in Social Summer of code.",
        "Contributing in 2 organisations so far based on python and ML.",
      ],
    },
  {
    title: "Want to Elevate Your Team with My Skills",
    company_name: "Reach Out to Me!",
    icon: im,
    iconBg: "#FFE7A7",
    date: "Present",
    points: [
      "Computer Vision: Proficient in developing and deploying computer vision models, including image classification, object detection, and semantic segmentation.",

      "MLOps Proficiency: Experienced in hosting models using efficient pipelines, highlighting my commitment to best practices and contributing to the seamless development and deployment of machine learning solutions.",

      "Continuous Learning: Actively engage in Kaggle Competitions, staying abreast of the latest trends and methodologies in the field, ensuring a forward-thinking approach to problem-solving.",

      "If there's any kind of help you need in the above-mentioned fields, feel free to reach out to me! And please provide me with feedback.",
    ],
  },
];

// ----------------------------------SocialLinks
export const socialLinks = [
    {
        name: 'Contact',
        iconUrl: contact,
        link: '/contact',
    },
    {
        name: 'GitHub',
        iconUrl: github,
        link: 'https://github.com/Shiv-Expert2503',
    },
    {
        name: 'Twitter',
        iconUrl: x,
        link: 'https://twitter.com/Shivansh_EXPERT',
    },
    {
        name: 'Kaggle',
        iconUrl: k,
        link: 'https://www.kaggle.com/shivansh2503',
    },
    {
        name: 'Upwork',
        iconUrl: upwork,
        link: 'https://www.upwork.com/freelancers/~015bed8dd942d917b3',
    },
    {
        name: 'LinkedIn',
        iconUrl: linkdin,
        link: 'https://www.linkedin.com/in/shivansh-singh-1a6771255/',
    }
];

// ----------------------------------Projects
export const projects = [
  {
    iconUrl: pricewise,
    theme: "btn-back-red",
    name: "Ghost Mouse",
    description:
      "Developed an innovative eye-tracking-based mouse control system using Python, enabling hands-free interaction with a laptop. Implemented advanced coordinate interpolation techniques to ensure smooth and precise cursor movement. Overcame challenges of tracking eye movements with a standard laptop webcam by optimizing detection algorithms for low-resolution input. Successfully mapped eye gaze to on-screen coordinates, enhancing accessibility and human-computer interaction.",
    link: "https://github.com/Shiv-Expert2503/Ghoust_Mouse",
  },
  {
    iconUrl: threads,
    theme: "btn-back-green",
    name: "3-D HandTracking Application",
    description:
      "Introducing a groundbreaking application designed to seamlessly track hand movements in three dimensions through a standard 2-D webcam feed. Unlocking an additional depth factor, this innovative solution opens the gateway to exciting possibilities, including the creation of immersive Virtual Reality (V-R) games. A pivotal tool for precise movement tracking. Check out the link below for a deatiled explanation and code!",
    link: "https://github.com/Shiv-Expert2503/Game_Dev",
  },
  {
    iconUrl: car,
    theme: "btn-back-blue",
    name: "Telegram Bot",
    description:
      "Build a Telegram Censor Bot that automatically deletes messages containing profanity, ensuring a safe and welcoming environment for all users. This project was a pivotal opportunity for me to augment my proficiency in Natural Language Processing (NLP), reflecting my commitment to staying abreast of cutting-edge technologies and methodologies within the field. The bot can also transcribes the audio in 100+ different languages. It is also capable to analyze and remove NSFW content from images. Check out the link below to see the code!",
    link: "https://github.com/Shiv-Expert2503/Censored_Bot",
  },
  {
    iconUrl: snapgram,
    theme: "btn-back-pink",
    name: "Linking Writting",
    description:
      "The goal of this project is to predict overall writing quality. Does typing behavior affect the outcome of an essay? I have developed a model trained on a large dataset of keystroke logs that have captured writing process features. As it's difficult to summarize the complex set of behavioral actions and cognitive activities in the writing process. The model is capable of predicting the overall quality of an essay. Check out the link below to see the code! Currently, I am working on the deployment of this model.",
    link: "https://github.com/Shiv-Expert2503/Linking_Writing",
  },
  {
    iconUrl: estate,
    theme: "btn-back-black",
    name: "Sensor Fault Detection",
    description:
      "I successfully designed and developed a web application dedicated to Sensor Fault Detection, adhering to contemporary industrial coding practices. The backend of the application was crafted using Flask, and it was deployed on the Azure cloud platform. To enhance efficiency and streamline deployment, I employed pipelines and Docker for process automation. This project served as a pivotal opportunity for me to augment my proficiency in MLOps, reflecting my commitment to staying abreast of cutting-edge technologies and methodologies within the field. Check out the link below to see the code!",
    link: "https://github.com/Shiv-Expert2503/Sensor_Fault",
  },
  {
    iconUrl: summiz,
    theme: "btn-back-yellow",
    name: "AI Segmentation Application",
    description: `Developed a web application that segments anything using s.a.m open source model by Meta. The main goal of this project was to learn how to host a deep learning model on a server and use it in a web application. I used streamlit for the user interface. The model was hosted on Azure, and the web application was deployed on my personal website. Click the below link to check it out!`,
    link: "https://bgremov.azurewebsites.net/",
  },
];