import { k, gg, im, intern, upwork, linkdin, x } from "../assets/images";
import { license, comparison, comparison2, combined_gifs, sensor1_comp, license_detect, absolute_error, all_losses, solution_all, absolute_error_all_2d} from "../assets/visuals"; //Protfolio/src/assets/visuals
// For now, I'll use placeholders.
import {
    contact,
    css,
    git,
    github,
    html,
    mongodb,
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
    opencv,
    pytorch
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
        imageUrl: pytorch,
        name: "Pytorch",
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
    // {
    //   title: "Freelance Machine Learning Engineer",
    //   company_name: "Upwork",
    //   icon: upwork,
    //   iconBg: "#B7FFC9",
    //   date: "November 2023 - Present",
    //   points: [
    //     "Engineered and deployed a robust data scraping pipeline to extract structured information from dynamic Google SERPs using Python and Scrapy.",
    //     "It was about scrapping the data for the client.",
    //     "Gained a lot of experience as the data which need to be scrapped is from google serps.",
    //   ],
    // },
    {
      title: "Notebooks Expert",
      company_name: "Kaggle",
      icon: k,
      iconBg: "#accbe1",
      date: "November 2023 - Present",
      points: [
        "Achieved Kaggle Notebooks Expert status, ranking in the top 4% globally among over 50,000 + data scientists.",
        "Authored high-quality, reproducible notebooks demonstrating advanced techniques in data analysis, feature engineering, and model training for complex datasets.",
        "Developed and documented end-to-end MLOps pipelines within notebooks to showcase model deployment and versioning best practices.",
      ],
    },
    // {
    //   title: "Open Source Contributor",
    //   company_name: "Github",
    //   icon: gg,
    //   iconBg: "#6E6E6E",
    //   date: "April 2023 - Present",
    //   points: [
    //     "Actively contributing to Python-based machine learning organizations, focusing on improving model performance and code maintainability.",
    //     "Implemented new features and resolved bugs during the Social Summer of Code, collaborating with a global team of developers in an agile environment.",
    //     "Submitted pull requests that were successfully merged, enhancing the functionality of core data processing and utility modules.",
    //   ],
    // },
//   {
//     title: "",
//     company_name: "",
//     icon: im,
//     iconBg: "#FFE7A7",
//     date: "Present",
//     points: [],
//   },
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
    // {
    //     name: 'Upwork',
    //     iconUrl: upwork,
    //     link: 'https://www.upwork.com/freelancers/~015bed8dd942d917b3',
    // },
    {
        name: 'LinkedIn',
        iconUrl: linkdin,
        link: 'https://www.linkedin.com/in/shivansh-singh-1a6771255/',
    }
];

// ----------------------------------Projects
// export const projects = [
//   {
//     iconUrl: pricewise,
//     theme: "btn-back-red",
//     name: "Self-Adapting AI Solver for Physics Simulation",
//     description:
//       "Developed an innovative eye-tracking-based mouse control system using Python, enabling hands-free interaction with a laptop. Implemented advanced coordinate interpolation techniques to ensure smooth and precise cursor movement. Overcame challenges of tracking eye movements with a standard laptop webcam by optimizing detection algorithms for low-resolution input. Successfully mapped eye gaze to on-screen coordinates, enhancing accessibility and human-computer interaction.",
//     link: "https://github.com/Shiv-Expert2503/Ghoust_Mouse",
//   },
//   {
//     iconUrl: estate,
//     theme: "btn-back-black",
//     name: "Sensor Fault Detection",
//     description:
//       "I successfully designed and developed a web application dedicated to Sensor Fault Detection, adhering to contemporary industrial coding practices. The backend of the application was crafted using Flask, and it was deployed on the Azure cloud platform. To enhance efficiency and streamline deployment, I employed pipelines and Docker for process automation. This project served as a pivotal opportunity for me to augment my proficiency in MLOps, reflecting my commitment to staying abreast of cutting-edge technologies and methodologies within the field. Check out the link below to see the code!",
//     link: "https://github.com/Shiv-Expert2503/Sensor_Fault",
//   },
//   {
//     iconUrl: summiz,
//     theme: "btn-back-yellow",
//     name: "AI Segmentation Application",
//     description: `Developed a web application that segments anything using s.a.m open source model by Meta. The main goal of this project was to learn how to host a deep learning model on a server and use it in a web application. I used streamlit for the user interface. The model was hosted on Azure, and the web application was deployed on my personal website. Click the below link to check it out!`,
//     link: "https://bgremov.azurewebsites.net/",
//   },
// ];

export const projects = [
  {
    // Tier 1: SciML & AI Research
    visuals: [
        { type: 'image', src: all_losses },
        { type: 'image', src: absolute_error },
        { type: 'image', src: absolute_error_all_2d },
        { type: 'image', src: solution_all }
    ],
    theme: "",
    name: "1. Self-Adapting AI Solver for Physics Simulation",
    tags: ['SciML', 'PINNs', 'PyTorch', 'Adaptive Sampling', 'Quassi-Newton Optimizer'],
    oneLiner: "An intelligent AI solver that adapts its training to solve complex physics problems with higher accuracy and less computation.",
    description: [
        "Built and validated a foundational PINN from scratch using an Adam optimizer, achieving a final Mean Squared Error of 1.55e-06 against the analytical solution.",
        "Systematically compared this baseline against two advanced training strategies: a Residual-Based Adaptive Sampling (RBS) algorithm and a hybrid optimizer combining Adam with a Quasi-Newton method (L-BFGS).",
        "The hybrid Adam + L-BFGS approach proved to be the superior strategy, reducing the final MSE by ~80% to 3.11e-07, demonstrating the power of second-order optimization for fine-tuning",
    ],
    links: {
      github: "https://github.com/Shiv-Expert2503/PINNs",
    //   analysis: "https://your-blog.com/pinn-analysis" // Link to your blog post
    }
  },
  {
    // visuals: [comparison, comparison2, combined_gifs], // Placeholder
    visuals: [
      { type: 'image', src: comparison},
      { type: 'image', src: comparison2 },
      { type: 'image', src: combined_gifs }
    ],
    theme: ["btn-back-blue"],
    name: "2. Implicit Neural Representations with SIRENs",
    tags: ['Implicit Representations', 'PyTorch', 'Computer Vision', 'Custom Activation Functions', 'Streamlit', 'Custom Weights Initialization'],
    oneLiner: "Representing complex signals like images as a continuous function within the weights of a tiny neural network.",
    description: [
        "Implemented a Sinusoidal Representation Network (SIREN) using periodic activation functions to map coordinates (x, y) to pixel values (R, G, B).",
        "Demonstrated the model's ability to reconstruct high-frequency details in images with extreme memory efficiency compared to traditional bitmap storage.",
        "When zoomed, the model generates new pixel values dynamically — no stretching or loss.",
        "Created an interactive Streamlit demo allowing users to see the reconstruction process in real-time."
    ],
    links: {
      github: "https://github.com/Shiv-Expert2503/SIREN_Streamlit",
      demo: "https://sirenapp-shivexpert.streamlit.app/"
    }
  },
  // Tier 2: End-to-End ML Applications
  {
    visuals: [
        { type: 'video', mp4: license },
        { type: 'video', mp4: license_detect }
    ],
    theme: ["btn-back-blue"],
    name: "3. Real-Time License Plate Anonymizer",
    tags: ['Computer Vision', 'YOLOv8', 'DeepSort', 'OpenCV', 'TensorFlow'],
    oneLiner: "A robust computer vision pipeline that automatically detects, tracks, and blurs license plates to ensure privacy.",
    description: [
        "Engineered a high-performance system combining YOLOv8 for detection with DeepSort for persistent multi-object tracking across video frames.",
        "Implemented real-time blurring using OpenCV, creating a solution adaptable for static images, videos, and live camera streams.",
        "Designed as an ethical surveillance tool to balance security needs with individual privacy rights."
    ],
    links: {
      github: "https://github.com/Shiv-Expert2503/License_Blur",
    //   demo: "https://youtube.com/your-demo-video" // A link to a demo video is great here
    }
  },
//   {
//     visuals: [], // Placeholder
//     theme: ["btn-back-blue"],
//     name: '4. AI-Powered "Segment Anything" Application',
//     tags: ['Foundation Models', 'Meta AI (SAM)', 'Streamlit', 'TensorFlow', 'Image Segmentation'],
//     oneLiner: "An interactive web app utilizing Meta AI's state-of-the-art Segment Anything Model (SAM) for image segmentation.",
//     description: [
//         "Integrated the large-scale SAM foundation model into a user-friendly Streamlit interface, allowing users to upload an image and get segmentation masks.",
//         "Successfully managed model hosting and deployment on a cloud server, demonstrating the ability to serve large, pre-trained AI models."
//     ],
//     links: {
//       github: "https://github.com/your-repo/segment-anything-app",
//       demo: "https://your-segment-app.com"
//     }
//   },
  {
    // Placeholder
    visuals: [
        { type: 'video', webm: sensor1_comp }
    ],
    theme: ["btn-back-blue"],
    name: "4. Industrial Sensor Fault Detection System",
    tags: ['MLOps', 'Flask', 'Docker', 'Azure'],
    oneLiner: "A full-stack web application to detect sensor failures in real-time, built with industrial-grade MLOps practices.",
    description: [
        "Developed a robust Flask backend and deployed the application on Render, served by a production-grade Gunicorn WSGI server.",
        "Architected with a full MLOps lifecycle, including reproducible training/prediction pipelines, artifact management, and containerization via a Dockerfile for portability.",
        "Leverages Continuous Deployment through Render's Git-based workflow, automatically building and deploying new versions on every push to the main branch."
    ],
    links: {
      github: "https://github.com/Shiv-Expert2503/Sensor_Fault",
      demo: "https://sensor-fault-0bkp.onrender.com/"
    }
  }
];


//redundant and outdated projects

  // {
  //   iconUrl: threads,
  //   theme: "btn-back-green",
  //   name: "3-D HandTracking Application",
  //   description:
  //     "Introducing a groundbreaking application designed to seamlessly track hand movements in three dimensions through a standard 2-D webcam feed. Unlocking an additional depth factor, this innovative solution opens the gateway to exciting possibilities, including the creation of immersive Virtual Reality (V-R) games. A pivotal tool for precise movement tracking. Check out the link below for a deatiled explanation and code!",
  //   link: "https://github.com/Shiv-Expert2503/Game_Dev",
  // },
  // {
  //   iconUrl: car,
  //   theme: "btn-back-blue",
  //   name: "Telegram Bot",
  //   description:
  //     "Build a Telegram Censor Bot that automatically deletes messages containing profanity, ensuring a safe and welcoming environment for all users. This project was a pivotal opportunity for me to augment my proficiency in Natural Language Processing (NLP), reflecting my commitment to staying abreast of cutting-edge technologies and methodologies within the field. The bot can also transcribes the audio in 100+ different languages. It is also capable to analyze and remove NSFW content from images. Check out the link below to see the code!",
  //   link: "https://github.com/Shiv-Expert2503/Censored_Bot",
  // },
  // {
  //   iconUrl: snapgram,
  //   theme: "btn-back-pink",
  //   name: "Linking Writting",
  //   description:
  //     "The goal of this project is to predict overall writing quality. Does typing behavior affect the outcome of an essay? I have developed a model trained on a large dataset of keystroke logs that have captured writing process features. As it's difficult to summarize the complex set of behavioral actions and cognitive activities in the writing process. The model is capable of predicting the overall quality of an essay. Check out the link below to see the code! Currently, I am working on the deployment of this model.",
  //   link: "https://github.com/Shiv-Expert2503/Linking_Writing",
  // },